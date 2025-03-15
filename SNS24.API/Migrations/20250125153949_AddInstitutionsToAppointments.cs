using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SNS24.WebApi.Migrations
{
    /// <inheritdoc />
    public partial class AddInstitutionsToAppointments : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "InstitutionId",
                table: "Appointments",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "IntitutionId",
                table: "Appointments",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_InstitutionId",
                table: "Appointments",
                column: "InstitutionId");

            migrationBuilder.AddForeignKey(
                name: "FK_Appointments_Institutions_InstitutionId",
                table: "Appointments",
                column: "InstitutionId",
                principalTable: "Institutions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Appointments_Institutions_InstitutionId",
                table: "Appointments");

            migrationBuilder.DropIndex(
                name: "IX_Appointments_InstitutionId",
                table: "Appointments");

            migrationBuilder.DropColumn(
                name: "InstitutionId",
                table: "Appointments");

            migrationBuilder.DropColumn(
                name: "IntitutionId",
                table: "Appointments");
        }
    }
}
