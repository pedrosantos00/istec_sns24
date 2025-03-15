using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SNS24.WebApi.Migrations
{
    /// <inheritdoc />
    public partial class AddedNotificationState : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "NotificationState",
                table: "MedicalLeaves",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NotificationState",
                table: "MedicalLeaves");
        }
    }
}
