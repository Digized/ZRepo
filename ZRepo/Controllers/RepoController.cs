using Microsoft.AspNetCore.Mvc;

namespace ZRepo.Controllers
{
    [Route("api/[controller]")]
    public class RepoController : Controller
    {
        public ActionResult FileTree(string repo)
        {
            if (repo == null)
            {
                return BadRequest("No Repo Specified");
            }
            return Ok();
        }
    }
}