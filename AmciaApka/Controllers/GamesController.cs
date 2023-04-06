using System.Security.AccessControl;
using AmciaApka.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AmciaApka.Controllers
{
    public class GamesController : Controller
    {
        private readonly ApplicationDbContext _context;
        public GamesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [Authorize(Policy = "RequireLoggedIn")]
        public IActionResult Memory()
        {
            return View();
        }

        [Authorize(Policy = "RequireLoggedIn")]
        public IActionResult matchImgToNumber()
        {
            return View();
        }

        [Authorize(Policy = "RequireLoggedIn")]
        public IActionResult patternGame()
        {
            return View();
        }

        [Authorize(Policy = "RequireLoggedIn")]
        public IActionResult matchEmotions()
        {
            return View();
        }

        [Authorize(Policy = "RequireLoggedIn")]
        public IActionResult Quiz()
        {
            return View();
        }

        [Authorize(Policy = "RequireLoggedIn")]
        public IActionResult getDifficulty([FromQuery] string gameType)
        {
            string userName = HttpContext.User.Identity.Name;
            var user = _context.Users.FirstOrDefault(u => u.Name == userName);
            int difficulty = 1;
            switch (gameType)
            {
                case "Memory":
                    difficulty = user.MemoryDifficulty;
                    break;
                case "Dopasuj ilosc":
                    difficulty = user.MatchImgToNumberDifficulty;
                    break;
                case "Dopasuj emocje":
                    difficulty = user.MatchEmotionsDifficulty;
                    break;
                case "Quiz":
                    difficulty = user.QuizDifficulty;
                    break;
                case "Dopasuj wzor":
                    difficulty = user.PatternGameDifficulty;
                    break;
            }
            return Json(difficulty);
        }

        [Authorize(Policy = "RequireLoggedIn")]
        [HttpPost]
        public IActionResult sendResults([FromBody] GameResults gameResults)
        {
            string userName = HttpContext.User.Identity.Name;
            var user = _context.Users.FirstOrDefault(u => u.Name == userName);
            gameResults.UserId = user.Id;
            gameResults.Date = DateTime.Now;
            _context.GameResults.Add(gameResults);
            _context.SaveChanges();
            var game = _context.GameResults.FirstOrDefault(g => g.Id == gameResults.Id);
            var averageMistakes = _context.GameResults
                .Where(g => g.GameType == game.GameType && g.UserId == user.Id)
                .Average(g => g.Mistakes);

            var averageTime = _context.GameResults
                .Where(g => g.GameType == game.GameType && g.UserId == user.Id)
                .Average(g => g.Time);

            if (game.Difficulty > 0 && game.GameType == "Memory")
            {
                var gamesPlayed = user.MemoryGamesPlayed + 1;
                if (gamesPlayed >= 5 && averageMistakes < 3 && averageTime < 30)
                {
                    if(user.MemoryDifficulty < 3)
                    {
                        user.MemoryDifficulty += 1;
                        user.MemoryGamesPlayed = 0;
                    }
                }
                else
                {
                    user.MemoryGamesPlayed = gamesPlayed;
                }
            }
            else if (game.Difficulty > 0 && game.GameType == "Dopasuj ilosc")
            {
                var gamesPlayed = user.MatchImgToNumberGamesPlayed + 1;
                if (gamesPlayed >= 5 && averageMistakes < 3 && averageTime < 30)
                {
                    if (user.MatchImgToNumberDifficulty < 3)
                    {
                        user.MatchImgToNumberDifficulty += 1;
                        user.MatchImgToNumberGamesPlayed = 0;
                    }
                }
                else
                {
                    user.MatchImgToNumberGamesPlayed = gamesPlayed;
                }
            }
            else if (game.Difficulty > 0 && game.GameType == "Dopasuj emocje")
            {
                var gamesPlayed = user.MatchEmotionsGamesPlayed + 1;
                if (gamesPlayed >= 5 && averageMistakes < 3 && averageTime < 30)
                {
                    if (user.MatchEmotionsDifficulty < 3)
                    {
                        user.MatchEmotionsDifficulty += 1;
                        user.MatchEmotionsGamesPlayed = 0;
                    }
                }
                else
                {
                    user.MatchEmotionsGamesPlayed = gamesPlayed;
                }
            }
            else if (game.Difficulty > 0 && game.GameType == "Quiz")
            {
                var gamesPlayed = user.QuizGamesPlayed + 1;
                if (gamesPlayed >= 5 && averageMistakes < 3 && averageTime < 30)
                {
                    if (user.QuizDifficulty < 3)
                    {
                        user.QuizDifficulty += 1;
                        user.QuizGamesPlayed = 0;
                    }
                }
                else
                {
                    user.QuizGamesPlayed = gamesPlayed;
                }
            }
            else if (game.Difficulty > 0 && game.GameType == "Dopasuj wzor")
            {
                var gamesPlayed = user.PatternGameGamesPlayed + 1;
                if (gamesPlayed >= 5 && averageMistakes < 3 && averageTime < 30)
                {
                    if (user.PatternGameDifficulty < 3)
                    {
                        user.PatternGameDifficulty += 1;
                        user.PatternGameGamesPlayed = 0;
                    }
                }
                else
                {
                    user.PatternGameGamesPlayed = gamesPlayed;
                }
            }
            _context.Users.Update(user);
            _context.SaveChanges();
            return Ok();
        }

    }
    
}
