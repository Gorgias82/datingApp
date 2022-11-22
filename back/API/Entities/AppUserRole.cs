using Microsoft.AspNetCore.Identity;

namespace API.Entities
{
  //Actua como una join table
  public class AppUserRole : IdentityUserRole<int>
  {
    public AppUser User { get; set; }
    public AppRole Role { get; set; }
  }
}
