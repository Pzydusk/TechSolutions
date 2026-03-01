using Microsoft.AspNetCore.Mvc;

namespace TechSolutions.Web.Controllers
{
    public class AccountController : Controller
    {
        public IActionResult Login() => View();

        public IActionResult Register() => View();

        public IActionResult Logout()
        {
            return View();
        }
    }
}
