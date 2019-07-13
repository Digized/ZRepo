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

        [Route("api/repo/tree/{repo}")]
        public IActionResult FileTree(string repo)
        {
            if (repo == null)
            {
                return BadRequest("No Repo Specified");
            }
            return Json(gitCore.GenerateTree(repo));

        }


        [Route("api/repo/file/{repo}/{*filePath}")]
        public IActionResult FileTree(string repo, string filePath)
        {
            if (repo == null)
            {
                return BadRequest("No Repo Specified");
            }
            return Json(gitCore.GetFile(repo, filePath));

        }
    }
}