using AutoMapper;
using API.Data;
using API.Helpers;
using API.Interfaces;
using API.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.SignalR;

namespace API.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddAplicationServices(this IServiceCollection services, IConfiguration config)
        {
            //se añade la interface y la clase que se encarga de crear los JWT tokens
            services.AddScoped<ITokenService, TokenService>();
            //se añaden los parametros de configuracion de cloudinary usando el appsettings.json y la clase cloudinarySettings
            services.Configure<CloudinarySettings>(config.GetSection("CloudinarySettings"));
            //se añade la interface y la clase que se encarga de gestionar el servicio de fotos de cloudinary
            services.AddScoped<IPhotoService, PhotoService>();       
            //se añade el helper loguseractivity
            services.AddScoped<LogUserActivity>();         
            //añade los servicios para las online presences
            services.AddSignalR();
            //este servicio se queda vivo por eso se añade asi y no como scoped
            services.AddSingleton<PresenceTracker>();
            services.AddAutoMapper(typeof(AutoMapperProfiles).Assembly);

            //esta interface y servicio sustituye a los repositorios
            services.AddScoped<IUnitOfWork, UnitOfWork>();




      //se añade el context
      services.AddDbContext<DataContext>(options =>
            {
                //toma los datos de appsettings.json
                options.UseSqlite(config.GetConnectionString("DefaultConnection"));
            });

            return services;
        }
    }
}
