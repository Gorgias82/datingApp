using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Interfaces
{
    public interface IPhotoService
    {
        Task<ImageUploadResult> AddPhotoAsync(IFormFile file);

        //Para eliminar fotos en cloudinary no vale con la url
        //se necesita el publicId
        Task<DeletionResult> DeletePhotoAsync(string publicId);
    }
}
