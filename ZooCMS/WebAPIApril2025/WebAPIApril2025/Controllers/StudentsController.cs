using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using WebAPIApril2025.Data;
using WebAPIApril2025.Models;
using WebAPIApril2025.DTOs;

[Route("api/[controller]")]
[ApiController]
public class StudentsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public StudentsController(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<StudentDto>>> GetStudents()
    {
        var students = await _context.Set<Student>().ToListAsync();
        return Ok(_mapper.Map<List<StudentDto>>(students));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<StudentDto>> GetStudent(int id)
    {
        var student = await _context.Set<Student>().FindAsync(id);
        if (student == null) return NotFound();
        return Ok(_mapper.Map<StudentDto>(student));
    }

    [HttpPost]
    public async Task<ActionResult<StudentDto>> CreateStudent(StudentCreateDto studentCreateDto)
    {
        var student = _mapper.Map<Student>(studentCreateDto);
        _context.Set<Student>().Add(student);
        await _context.SaveChangesAsync();
        var studentDto = _mapper.Map<StudentDto>(student);
        return CreatedAtAction(nameof(GetStudent), new { id = student.Id }, studentDto);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateStudent(int id, StudentCreateDto studentUpdateDto)
    {
        var student = await _context.Set<Student>().FindAsync(id);
        if (student == null) return NotFound();
        _mapper.Map(studentUpdateDto, student);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteStudent(int id)
    {
        var student = await _context.Set<Student>().FindAsync(id);
        if (student == null) return NotFound();
        _context.Set<Student>().Remove(student);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}