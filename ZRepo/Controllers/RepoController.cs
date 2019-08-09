using System.Collections.Generic;
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

        [Route("api/repo")]
        public IActionResult GetRepos()
        {
            return Json(gitCore.GetRepos());
        }

        [Route("api/repo/{repo}/tree/{*filePath}")]
        public IActionResult GetTree(string repo, string filePath)
        {
            if (repo == null)
            {
                return BadRequest("No Repo Specified");
            }
            return Json(gitCore.GenerateTree(repo, filePath));

        }


        [Route("api/repo/{repo}/file/{*filePath}")]
        public IActionResult GetFile(string repo, string filePath)
        {
            if (repo == null)
            {
                return BadRequest("No Repo Specified");
            }
            return Json(gitCore.GetFile(repo, filePath));

        }
    }
}