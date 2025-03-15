using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SNS24.WebApi.Migrations
{
    /// <inheritdoc />
    public partial class Nullable_Profile_Picture_ApplicationUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_StoredFile_ProfilePictureId",
                table: "AspNetUsers");

            migrationBuilder.DropPrimaryKey(
                name: "PK_StoredFile",
                table: "StoredFile");

            migrationBuilder.RenameTable(
                name: "StoredFile",
                newName: "StoredFiles");

            migrationBuilder.AlterColumn<Guid>(
                name: "ProfilePictureId",
                table: "AspNetUsers",
                type: "uniqueidentifier",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.AddPrimaryKey(
                name: "PK_StoredFiles",
                table: "StoredFiles",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_StoredFiles_ProfilePictureId",
                table: "AspNetUsers",
                column: "ProfilePictureId",
                principalTable: "StoredFiles",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_StoredFiles_ProfilePictureId",
                table: "AspNetUsers");

            migrationBuilder.DropPrimaryKey(
                name: "PK_StoredFiles",
                table: "StoredFiles");

            migrationBuilder.RenameTable(
                name: "StoredFiles",
                newName: "StoredFile");

            migrationBuilder.AlterColumn<Guid>(
                name: "ProfilePictureId",
                table: "AspNetUsers",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_StoredFile",
                table: "StoredFile",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_StoredFile_ProfilePictureId",
                table: "AspNetUsers",
                column: "ProfilePictureId",
                principalTable: "StoredFile",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
