using System.ComponentModel.DataAnnotations;

namespace AmciaApka.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string Salt { get; set; }
        public string Role { get; set; }
        public int MemoryDifficulty { get; set; } = 1;
        public int MemoryGamesPlayed { get; set; }

        public int MatchImgToNumberDifficulty { get; set; } = 1;
        public int MatchImgToNumberGamesPlayed { get; set; }

        public int PatternGameDifficulty { get; set; } = 1;
        public int PatternGameGamesPlayed { get; set; }

        public int MatchEmotionsDifficulty { get; set; } = 1;
        public int MatchEmotionsGamesPlayed { get; set; }

        public int QuizDifficulty { get; set; } = 1;
        public int QuizGamesPlayed { get; set; }

        public ICollection<GameResults>? GameResults { get; set; }
    }

}
