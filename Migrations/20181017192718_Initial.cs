using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace hhfe.Migrations
{
    public partial class Initial : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Sensors",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    NodeId = table.Column<string>(nullable: true),
                    Name = table.Column<string>(nullable: false),
                    Longitude = table.Column<double>(nullable: false),
                    Latitude = table.Column<double>(nullable: false),
                    Altitude = table.Column<double>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Sensors", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SensorDatas",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    Timestamp = table.Column<DateTimeOffset>(nullable: false),
                    ParticulateMatter25 = table.Column<double>(nullable: false),
                    ParticulateMatter100 = table.Column<double>(nullable: false),
                    AirTemperature = table.Column<double>(nullable: false),
                    RelativeHumidity = table.Column<double>(nullable: false),
                    SensorId = table.Column<int>(nullable: false),
                    DataEnhancemetId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SensorDatas", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SensorDatas_Sensors_SensorId",
                        column: x => x.SensorId,
                        principalTable: "Sensors",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "DataEnhancements",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    WindDirection = table.Column<double>(nullable: true),
                    WindSpeed = table.Column<double>(nullable: false),
                    Pressure = table.Column<double>(nullable: false),
                    SensorDataId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DataEnhancements", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DataEnhancements_SensorDatas_SensorDataId",
                        column: x => x.SensorDataId,
                        principalTable: "SensorDatas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DataEnhancements_SensorDataId",
                table: "DataEnhancements",
                column: "SensorDataId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SensorDatas_SensorId",
                table: "SensorDatas",
                column: "SensorId");

            migrationBuilder.CreateIndex(
                name: "IX_Sensors_NodeId",
                table: "Sensors",
                column: "NodeId",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DataEnhancements");

            migrationBuilder.DropTable(
                name: "SensorDatas");

            migrationBuilder.DropTable(
                name: "Sensors");
        }
    }
}
