using AutoMapper;
using WebAPIApril2025.Models;
using WebAPIApril2025.DTOs;

public class StudentProfile : Profile
{
    public StudentProfile()
    {
        CreateMap<Student, StudentDto>();
        CreateMap<StudentCreateDto, Student>();
    }
}