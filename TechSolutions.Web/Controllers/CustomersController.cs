using Microsoft.AspNetCore.Mvc;

namespace TechSolutions.Web.Controllers
{
    public class CustomersController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Create()
        {
            return View();
        }

        public IActionResult Edit(Guid id)
        {
            ViewBag.Id = id;
            return View();
        }
    }
}
