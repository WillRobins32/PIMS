using MapsterMapper;
using Microsoft.AspNetCore.Mvc;
using Pims.Api.Policies;
using Pims.Dal.Security;
using Pims.Dal.Services.Admin;
using Swashbuckle.AspNetCore.Annotations;
using EModel = Pims.Dal.Entities.Models;
using Entity = Pims.Dal.Entities;
using Model = Pims.Api.Areas.Admin.Models.User;
using PModel = Pims.Api.Models;
using IUserService = Pims.Dal.Services.IUserService;

namespace Pims.Api.Areas.Admin.Controllers
{
    /// <summary>
    /// AccessRequestController class, provides endpoints for managing access requests.
    /// </summary>
    [HasPermission(Permissions.AdminUsers)]
    [ApiController]
    [Area("admin")]
    [ApiVersion("1.0")]
    [Route("v{version:apiVersion}/[area]/access/requests")]
    [Route("[area]/access/requests")]
    public class AccessRequestController : Controller
    {
        #region Properties
        private readonly IPimsAdminService _pimsAdminService;
        private readonly IMapper _mapper;
        private readonly IUserService _userService;
        #endregion

        #region Construstor
        public AccessRequestController(IPimsAdminService pimsAdminService,
            IMapper mapper, IUserService userService)
        {
            _pimsAdminService = pimsAdminService;
            _mapper = mapper;
            _userService = userService;
        }
        #endregion

        #region Endpoints
        /// <summary>
        /// Get a list of access requests
        /// </summary>
        /// <param name="page"></param>
        /// <param name="quantity"></param>
        /// <param name="sort"></param>
        /// <param name="status"></param>
        /// <returns></returns>
        [HttpGet("")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(PModel.PageModel<Model.AccessRequestModel>), 200)]
        [ProducesResponseType(typeof(Api.Models.ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "admin-access-requests" })]
        public IActionResult GetPage(int page = 1, int quantity = 10, string sort = null, Entity.AccessRequestStatus? status = Entity.AccessRequestStatus.OnHold)
        {
            if (page < 1) page = 1;
            if (quantity < 1) quantity = 1;
            if (quantity > 20) quantity = 20;
            var result = _pimsAdminService.User.GetAccessRequests(page, quantity, sort, status);
            var models = _mapper.Map<Model.AccessRequestModel[]>(result.Items);
            var paged = new PModel.PageModel<Model.AccessRequestModel>(models, page, quantity, result.Total);
            return new JsonResult(paged);
        }

        /// <summary>
        /// Delete an access requests
        /// </summary>
        /// <param name="id"></param>
        /// <param name="accessRequestModel"></param>
        [HttpDelete("{id}")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(Model.AccessRequestModel), 200)]
        [ProducesResponseType(typeof(Api.Models.ErrorResponseModel), 400)]
        [SwaggerOperation(Tags = new[] { "admin-access-requests" })]
        public IActionResult Delete(int id, [FromBody] Model.AccessRequestModel accessRequestModel)
        {
            var entity = _mapper.Map<Entity.AccessRequest>(accessRequestModel);
            _userService.DeleteAccessRequest(entity);
            return new JsonResult(accessRequestModel);
        }
        #endregion

    }
}
