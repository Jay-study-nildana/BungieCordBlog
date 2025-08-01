﻿using BungieCordBlogWebAPI.Models.Domain;
using BungieCordBlogWebAPI.Models.DTO;
using BungieCordBlogWebAPI.Repositories.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BungieCordBlogWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ImagesController : ControllerBase
    {
        private readonly IImageRepository imageRepository;

        public ImagesController(IImageRepository imageRepository)
        {
            this.imageRepository = imageRepository;
        }

        // GET: {apibaseURL}/api/Images
        [HttpGet]
        public async Task<IActionResult> GetAllImages()
        {
            // call image repository to get all images
            var images = await imageRepository.GetAll();

            // Convert Domain model to DTO
            var response = new List<BlogImageDto>();
            foreach (var image in images)
            {
                response.Add(new BlogImageDto
                {
                    Id = image.Id,
                    Title = image.Title,
                    DateCreated = image.DateCreated,
                    FileExtension = image.FileExtension,
                    FileName = image.FileName,
                    Url = image.Url
                });
            }

            return Ok(response);
        }


        //to bypass the Swagger issue where Swagger will not work when we use multiple [FromForm] tags. 
        public class ImageUploadRequest
        {
            [FromForm]
            public IFormFile File { get; set; }
            [FromForm]
            public string FileName { get; set; }
            [FromForm]
            public string Title { get; set; }
        }

        // POST: {apibaseurl}/api/images
        [HttpPost]
        //public async Task<IActionResult> UploadImage([FromForm] IFormFile file,
        //    [FromForm] string fileName, [FromForm] string title)
        //I had to change this, because of this 
        //https://github.com/domaindrivendev/Swashbuckle.AspNetCore#handle-forms-and-file-uploads
        //public async Task<IActionResult> UploadImage(IFormFile file,
        //    string fileName, string title)
        //{ //this was the original code, but, I had to change it to make it work with the react app
        //the angular code was working but react does not seem to work.
        public async Task<IActionResult> UploadImage([FromForm] ImageUploadRequest request)
        {
            var file = request.File;
            var fileName = request.FileName;
            var title = request.Title;
            ValidateFileUpload(file);

            if (ModelState.IsValid)
            {
                // File upload
                var blogImage = new BlogImage
                {
                    FileExtension = Path.GetExtension(file.FileName).ToLower(),
                    FileName = fileName,
                    Title = title,
                    DateCreated = DateTime.Now
                };

                blogImage = await imageRepository.Upload(file, blogImage);

                // Convert Domain Model to DTO
                var response = new BlogImageDto
                {
                    Id = blogImage.Id,
                    Title = blogImage.Title,
                    DateCreated = blogImage.DateCreated,
                    FileExtension = blogImage.FileExtension,
                    FileName = blogImage.FileName,
                    Url = blogImage.Url
                };

                return Ok(response);
            }

            return BadRequest(ModelState);
        }

        private void ValidateFileUpload(IFormFile file)
        {
            var allowedExtensions = new string[] { ".jpg", ".jpeg", ".png" };

            if (!allowedExtensions.Contains(Path.GetExtension(file.FileName).ToLower()))
            {
                ModelState.AddModelError("file", "Unsupported file format");
            }

            if (file.Length > 10485760)
            {
                ModelState.AddModelError("file", "File size cannot be more than 10MB");
            }
        }

    }
}
