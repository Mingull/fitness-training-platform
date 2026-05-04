type NodeLoader<T> = T | (() => T | Promise<T>);

type NodeDefinition<TNode> = {
	value: NodeLoader<TNode>;
	aliases: readonly (string & {})[];
};

type RegistryNode<TNode> = NodeLoader<TNode> | NodeDefinition<TNode>;

type UnwrapNodeLoader<T> = T extends () => infer TResult ? Awaited<TResult> : T;

type RegistryNodeValue<TNode> = TNode extends NodeDefinition<infer TValue> ? UnwrapNodeLoader<TValue> : UnwrapNodeLoader<TNode>;

type NodeLoaderForRegistryNode<TNode> =
	TNode extends NodeDefinition<infer TValue> ? NodeLoader<TValue>
	: TNode extends NodeLoader<infer TValue> ? NodeLoader<TValue>
	: never;

type RegistryOptions<TName extends string> = {
	onError?: (name: TName | (string & {}), error: unknown) => void;
	isSSR?: boolean;
	ttl?: number; // in milliseconds
};

type RegistryCanonicalNames<TNodes> = Extract<keyof TNodes, string>;

type RegistryAliasNames<TNodes> = {
	[K in keyof TNodes]: TNodes[K] extends { aliases: readonly (infer TAlias)[] } ? Extract<TAlias, string> : never;
}[keyof TNodes];

type RegistryLookupName<TNodes> = RegistryCanonicalNames<TNodes> | RegistryAliasNames<TNodes>;

type RegistryNodesWithAliases<TNodes extends Record<string, RegistryNode<unknown>>> = {
	[K in RegistryCanonicalNames<TNodes>]: NodeLoaderForRegistryNode<TNodes[K]>;
} & {
	[K in RegistryCanonicalNames<TNodes> as TNodes[K] extends { aliases: readonly (infer TAlias)[] } ? Extract<TAlias, string>
	:	never]: NodeLoaderForRegistryNode<TNodes[K]>;
};

type CachedNode<TNode> = (
	| {
			promise: Promise<TNode>;
			value?: never;
	  }
	| {
			promise?: never;
			value: TNode;
	  }
) & {
	timestamp: number;
};

/**
 * Creates a library registry.
 * @param nodes A record of node names to their loaders or alias-enabled definitions.
 * @param options Optional registry options.
 * @returns The created registry.
 */
export function createLibraryRegistry<const TNodes extends Record<string, RegistryNode<unknown>>>(
	nodes: TNodes,
	options?: RegistryOptions<RegistryLookupName<TNodes>>,
) {
	type TName = RegistryCanonicalNames<TNodes>;
	type TNode = RegistryNodeValue<TNodes[TName]>;
	type TLookupName = RegistryLookupName<TNodes>;

	const cache = new Map<TName, CachedNode<TNode>>();
	const ttl = options?.ttl ?? 0;
	const normalizedNameMap = new Map<string, TName>();
	const resolvedNodes = Object.create(null) as Record<TName, NodeLoader<TNode>>;
	const expandedNodes = {} as RegistryNodesWithAliases<TNodes>;

	const registerName = (lookupName: string, targetName: TName) => {
		const normalizedLookupName = lookupName.toLowerCase();
		const existingTarget = normalizedNameMap.get(normalizedLookupName);
		if (existingTarget && existingTarget !== targetName) {
			throw new Error(`Alias conflict: "${lookupName}" maps to both "${existingTarget}" and "${targetName}".`);
		}
		normalizedNameMap.set(normalizedLookupName, targetName);
	};

	const isNodeDefinition = (node: RegistryNode<TNode>): node is NodeDefinition<TNode> =>
		typeof node === "object" && node !== null && "aliases" in node && Array.isArray((node as NodeDefinition<TNode>).aliases);

	for (const [rawKey, node] of Object.entries(nodes) as [TName, TNodes[TName]][]) {
		const key = rawKey;
		const registryNode = node as RegistryNode<TNode>;
		if (isNodeDefinition(registryNode)) {
			resolvedNodes[key] = registryNode.value;
			expandedNodes[key as keyof RegistryNodesWithAliases<TNodes>] =
				registryNode.value as RegistryNodesWithAliases<TNodes>[keyof RegistryNodesWithAliases<TNodes>];
			registerName(key, key);
			for (const alias of registryNode.aliases) {
				registerName(String(alias), key);
				expandedNodes[alias as keyof RegistryNodesWithAliases<TNodes>] =
					registryNode.value as RegistryNodesWithAliases<TNodes>[keyof RegistryNodesWithAliases<TNodes>];
			}
			continue;
		}

		resolvedNodes[key] = registryNode as NodeLoader<TNode>;
		expandedNodes[key as keyof RegistryNodesWithAliases<TNodes>] = registryNode as RegistryNodesWithAliases<TNodes>[keyof RegistryNodesWithAliases<TNodes>];
		registerName(key, key);
	}

	const isStale = (entry: CachedNode<TNode>) => ttl > 0 && Date.now() - entry.timestamp > ttl;

	const resolveName = (name: TLookupName | (string & {})): TName | null => {
		const rawName = String(name);
		if (Object.hasOwn(resolvedNodes, rawName)) {
			return rawName as TName;
		}

		return normalizedNameMap.get(rawName.toLowerCase()) ?? null;
	};

	const loadNode = async (name: TName): Promise<TNode> => {
		try {
			if (options?.isSSR) {
				throw new Error(`Dynamic import for "${name}" blocked in SSR mode.`);
			}

			const rawNode = resolvedNodes[name];
			const loader = typeof rawNode === "function" ? (rawNode as () => TNode | Promise<TNode>)() : rawNode;
			const promise = Promise.resolve(loader as TNode | Promise<TNode>)
				.then((value) => {
					cache.set(name, { value: value as TNode, timestamp: Date.now() });
					return value as TNode;
				})
				.catch((error) => {
					cache.delete(name);
					throw error;
				}) as Promise<TNode>;
			cache.set(name, { promise, timestamp: Date.now() });

			return await promise;
		} catch (err) {
			options?.onError?.(name, err);
			throw err;
		}
	};

	const get = (name: TLookupName | (string & {})): Promise<TNode> => {
		const resolvedName = resolveName(name);
		if (!resolvedName) {
			const normalizedName = String(name).toLowerCase();
			const error = new Error(`Node "${normalizedName}" is not a valid name.`);
			options?.onError?.(normalizedName as TLookupName | (string & {}), error);
			return Promise.reject(error);
		}

		const entry = cache.get(resolvedName);
		if (!entry || isStale(entry)) {
			cache.delete(resolvedName);
			return loadNode(resolvedName);
		}

		if (entry.promise) {
			return entry.promise;
		}

		return Promise.resolve(entry.value);
	};

	const getSync = (name: TLookupName | (string & {})): TNode | null => {
		const resolvedName = resolveName(name);
		if (!resolvedName) {
			const error = new Error(`Node "${name}" is not a valid name.`);
			options?.onError?.(name as TLookupName | (string & {}), error);
			return null;
		}

		const entry = cache.get(resolvedName);
		if (!entry || isStale(entry) || typeof entry.value === "undefined") {
			return null;
		}
		return entry.value;
	};

	const preload = (name: TLookupName | (string & {})) => {
		const resolvedName = resolveName(name);
		if (!resolvedName) {
			return null;
		}

		return !cache.has(resolvedName) || isStale(cache.get(resolvedName)!) ? loadNode(resolvedName).catch(() => {}) : null;
	};

	const preloadAll = () => {
		for (const name in nodes) preload(name);
	};

	const reset = (name?: TLookupName | (string & {})) => {
		if (!name) {
			cache.clear();
			return;
		}

		const resolvedName = resolveName(name);
		if (resolvedName) {
			cache.delete(resolvedName);
		}
	};

	const isLoaded = (name: TLookupName | (string & {})) => {
		const resolvedName = resolveName(name);
		return Boolean(resolvedName && cache.has(resolvedName) && !isStale(cache.get(resolvedName)!));
	};

	return {
		get,
		getSync,
		preload,
		preloadAll,
		reset,
		isLoaded,
		nodes: expandedNodes,
	};
}
