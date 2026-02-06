using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TopconBlog.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AdicionarImagemCapa : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "imagem_capa_url",
                table: "postagens",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "imagem_capa_url",
                table: "postagens");
        }
    }
}
