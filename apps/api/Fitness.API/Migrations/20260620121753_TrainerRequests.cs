using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Mingull.Fitness.API.Migrations
{
    /// <inheritdoc />
    public partial class TrainerRequests : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "request_statuses",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    value = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    label = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_request_statuses", x => x.id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "trainer_relationships",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    athlete_id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    trainer_id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    start_date = table.Column<DateTimeOffset>(type: "datetime(6)", nullable: false),
                    end_date = table.Column<DateTimeOffset>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_trainer_relationships", x => x.id);
                    table.ForeignKey(
                        name: "fk_trainer_relationships_users_athlete_id",
                        column: x => x.athlete_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_trainer_relationships_users_trainer_id",
                        column: x => x.trainer_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "trainer_requests",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    athlete_id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    trainer_id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    status_id = table.Column<int>(type: "int", nullable: false),
                    message = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    created_at = table.Column<DateTimeOffset>(type: "datetime(6)", nullable: false),
                    updated_at = table.Column<DateTimeOffset>(type: "datetime(6)", nullable: true),
                    deleted_at = table.Column<DateTimeOffset>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_trainer_requests", x => x.id);
                    table.ForeignKey(
                        name: "fk_trainer_requests_request_statuses_status_id",
                        column: x => x.status_id,
                        principalTable: "request_statuses",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_trainer_requests_users_athlete_id",
                        column: x => x.athlete_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_trainer_requests_users_trainer_id",
                        column: x => x.trainer_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "request_statuses",
                columns: new[] { "id", "label", "value" },
                values: new object[,]
                {
                    { 1, "Pending", "pending" },
                    { 2, "Accepted", "accepted" },
                    { 3, "Rejected", "rejected" }
                });

            migrationBuilder.CreateIndex(
                name: "ix_trainer_relationships_athlete_id",
                table: "trainer_relationships",
                column: "athlete_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_trainer_relationships_trainer_id",
                table: "trainer_relationships",
                column: "trainer_id");

            migrationBuilder.CreateIndex(
                name: "ix_trainer_requests_athlete_id_status_id",
                table: "trainer_requests",
                columns: new[] { "athlete_id", "status_id" });

            migrationBuilder.CreateIndex(
                name: "ix_trainer_requests_status_id",
                table: "trainer_requests",
                column: "status_id");

            migrationBuilder.CreateIndex(
                name: "ix_trainer_requests_trainer_id",
                table: "trainer_requests",
                column: "trainer_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "trainer_relationships");

            migrationBuilder.DropTable(
                name: "trainer_requests");

            migrationBuilder.DropTable(
                name: "request_statuses");
        }
    }
}
