using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BuggyController : BaseApiController
    { 

        private readonly DataContext _context;
    
        public BuggyController(DataContext context)
        {
        _context = context;
        }

        [Authorize]
        [HttpGet("auth")]
        public ActionResult<string> GetSecret()
        {
            return "secret text";
        }
        [HttpGet("not-found")]
        public ActionResult<AppUser> GetNotFound()
        {
            //fuerza el error al buscar un usuario
            //con id -1, devuelve un null
            var thing = _context.Users.Find(-1);
            if (thing == null) return NotFound();

            return Ok(thing);
        }
        [HttpGet("server-error")]
        public ActionResult<string> GetServerError()
        {

            //fuerza el error al buscar un usuario
            //con id -1, devuelve un null
            var thing = _context.Users.Find(-1);

            //trata de ejecutar un metodo sobre null
            //salta nullreferenceexception
            var thingToReturn = thing.ToString();

            return thingToReturn;
        }
        [HttpGet("bad-request")]
        public ActionResult<string> GetBadRequest()
        {
            return BadRequest("bad request");
        }
       
    }
}
