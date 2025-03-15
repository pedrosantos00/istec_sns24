using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SNS24.WebApi.Migrations
{
    /// <inheritdoc />
    public partial class Changed_IsPublicSector_From_Doctor_To_Institution : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsPlublicSector",
                table: "AspNetUsers");

            migrationBuilder.AddColumn<bool>(
                name: "IsPlublicSector",
                table: "Institutions",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsPlublicSector",
                table: "Institutions");

            migrationBuilder.AddColumn<bool>(
                name: "IsPlublicSector",
                table: "AspNetUsers",
                type: "bit",
                nullable: true);
        }
    }
}
