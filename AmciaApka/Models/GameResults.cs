using System.ComponentModel.DataAnnotations;
namespace AmciaApka.Models
{
    public class GameResults
    {
        [Key]
        public int Id { get; set; }
        public int UserId { get; set; }
        public string GameType { get; set; }
        public int Difficulty { get; set; }
        public int Mistakes { get; set; }
        public int Time { get; set; }
        public DateTime Date { get; set; }

        public User User { get; set; }
    }

}
