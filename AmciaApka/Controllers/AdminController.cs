using AmciaApka.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace AmciaApka.Controllers
{
    public class AdminController : Controller
    {
        private readonly ApplicationDbContext _context;
        public AdminController(ApplicationDbContext context)
        {
            _context = context;
        }
        [Authorize(Policy = "AdminAccess")]
        public IActionResult Admin()
        {
            var results = _context.Users.Where(u => u.Role == "User").ToList();
            return View("AdminPanel", results);
        }
        [Authorize(Policy = "AdminAccess")]
        public IActionResult ShowGames(int id)
        {
            var games = _context.GameResults.Where(g => g.UserId == id)
                                 .GroupBy(g => g.GameType)
                                 .Select(group => group.First())
                                 .ToList();
            ViewBag.UserName = _context.Users.FirstOrDefault(u => u.Id == id).Name;
            return View(games);
        }
        [Authorize(Policy = "AdminAccess")]
        public IActionResult Details(string type, int id)
        {
            var games = _context.GameResults.Where(g => g.UserId == id && g.GameType == type);

            var results = games
                .GroupBy(g => g.Difficulty)
                .Select(group => new
                {
                    DifficultyLevel = group.Key,
                    AvgMistakes = group.Average(g => g.Mistakes),
                    GamesCount = group.Count(),
                    AvgTime = group.Average(g => g.Time),
                }).ToList();
            ViewBag.UserName = _context.Users.FirstOrDefault(u => u.Id == id).Name;
            ViewBag.Results = results;

            return View(games.ToList());
        }

    }
}
