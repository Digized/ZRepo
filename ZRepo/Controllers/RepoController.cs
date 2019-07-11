using Microsoft.AspNetCore.Mvc;
using ZRepo.Core;

namespace ZRepo.Controllers
{
    public class RepoController : Controller
    {

        private readonly GitCore gitCore;
        public RepoController(GitCore gitCore)
        {
            this.gitCore = gitCore;
        }

        [Route("api/repo/{repo}/tree")]
        public ActionResult FileTree(string repo)
        {
            if (repo == null)
            {
                return BadRequest("No Repo Specified");
            }
            return Json(gitCore.generateTree(repo));

        }
    }
}