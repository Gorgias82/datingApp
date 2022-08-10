using API.Helpers;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace API.Extensions
{
    public static class HttpExtensions
    {
        public static void AddPaginationHeader(this HttpResponse response, int currentPage, int itemsPerPage, int totalItems, int totalPages)
        {
            var paginationHeader = new PaginationHeader(currentPage, itemsPerPage, totalItems, totalPages);

            var options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };

            //se podria poner x-pagination, pero no es obligatorio
            //solo hay que poner un nombre significativo
            response.Headers.Add("Pagination", JsonSerializer.Serialize(paginationHeader, options));
            //esto si tiene que ser exacto
            response.Headers.Add("Access-Control-Expose-Headers", "Pagination");
        }
    }
}
