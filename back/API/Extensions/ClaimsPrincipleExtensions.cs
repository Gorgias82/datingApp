using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace API.Extensions
{
    public static class ClaimsPrincipleExtensions
    {
        public static string GetUserName(this ClaimsPrincipal user)
        {
            //devuelve el username que esta almacenado en el token
            //cuando se genera el token el tokenService se guarda el nombre de usuario
            return user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        }
    }
}
