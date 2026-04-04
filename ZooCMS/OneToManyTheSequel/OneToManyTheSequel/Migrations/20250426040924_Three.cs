using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OneToManyTheSequel.Migrations
{
    /// <inheritdoc />
    public partial class Three : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ZooKeepers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NameOfZooKeeper = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ZooKeepers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Zoos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NameOfZoo = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LocationOfZoo = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Zoos", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Bears",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BearName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ZooId = table.Column<int>(type: "int", nullable: false),
                    ZooKeeperId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Bears", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Bears_ZooKeepers_ZooKeeperId",
                        column: x => x.ZooKeeperId,
                        principalTable: "ZooKeepers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Bears_Zoos_ZooId",
                        column: x => x.ZooId,
                        principalTable: "Zoos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Birds",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BirdName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ZooId = table.Column<int>(type: "int", nullable: false),
                    ZooKeeperId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Birds", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Birds_ZooKeepers_ZooKeeperId",
                        column: x => x.ZooKeeperId,
                        principalTable: "ZooKeepers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Birds_Zoos_ZooId",
                        column: x => x.ZooId,
                        principalTable: "Zoos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Bears_ZooId",
                table: "Bears",
                column: "ZooId");

            migrationBuilder.CreateIndex(
                name: "IX_Bears_ZooKeeperId",
                table: "Bears",
                column: "ZooKeeperId");

            migrationBuilder.CreateIndex(
                name: "IX_Birds_ZooId",
                table: "Birds",
                column: "ZooId");

            migrationBuilder.CreateIndex(
                name: "IX_Birds_ZooKeeperId",
                table: "Birds",
                column: "ZooKeeperId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Bears");

            migrationBuilder.DropTable(
                name: "Birds");

            migrationBuilder.DropTable(
                name: "ZooKeepers");

            migrationBuilder.DropTable(
                name: "Zoos");
        }
    }
}
