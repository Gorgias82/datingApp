using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly DataContext _context;
        public UsersController(DataContext context)
        {
            _context = context;
        }

        //List tiene mas metodos que no necesitamos
        //asi que usamos inumerable
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<AppUser>>> GetUsers()
        {
            return await _context.Users.ToListAsync();

        }

        //en vez de pasar una query clasica
        //direcmente se pondria el dato al hacer el get en el service de angular
        //es decir clasico seria api/users?id=3
        //y  asi seria: api/users/3
        [Authorize]
        [HttpGet("{id}")]
        public async Task<AppUser> GetUsers(int id)
        {
            return await _context.Users.FindAsync(id);
     
        }

    }
}
