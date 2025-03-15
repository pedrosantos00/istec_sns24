using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SNS24.WebApi.Migrations
{
    /// <inheritdoc />
    public partial class fixIsPublicSectorName : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "IsPlublicSector",
                table: "Institutions",
                newName: "IsPublicSector");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "IsPublicSector",
                table: "Institutions",
                newName: "IsPlublicSector");
        }
    }
}
