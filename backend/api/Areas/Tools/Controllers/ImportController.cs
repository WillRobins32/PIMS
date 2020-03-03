using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Pims.Api.Areas.Tools.Helpers;
using Pims.Api.Areas.Tools.Models;
using Pims.Api.Models;
using Pims.Dal.Services.Admin;

namespace Pims.Api.Areas.Admin.Controllers
{
    /// <summary>
    /// ImportController class, provides endpoints for managing parcels.
    /// </summary>
    [Authorize(Roles = "system-administrator")]
    [ApiController]
    [Area("tools")]
    [Route("/api/[area]/[controller]")]
    public class ImportController : ControllerBase
    {
        #region Variables
        private readonly ILogger<ImportController> _logger;
        private readonly IPimsAdminService _pimsAdminService;
        private readonly IMapper _mapper;
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a ImportController class.
        /// </summary>
        /// <param name="logger"></param>
        /// <param name="pimsAdminService"></param>
        /// <param name="mapper"></param>
        public ImportController(ILogger<ImportController> logger, IPimsAdminService pimsAdminService, IMapper mapper)
        {
            _logger = logger;
            _pimsAdminService = pimsAdminService;
            _mapper = mapper;
        }
        #endregion

        #region Endpoints
        /// <summary>
        /// POST - Add an array of new properties to the datasource.
        /// Determines if the property is a parcel or a building and then adds or updates appropriately.
        /// This will also add new lookup items to the following; cities, agencies, building construction types, building predominate uses.
        /// </summary>
        /// <param name="models">An array of property models.</param>
        /// <returns>The properties added.</returns>
        [HttpPost("properties")]
        public IActionResult ImportProperties([FromBody] PropertyModel[] models)
        {
            var helper = new ImportPropertiesHelper(_pimsAdminService, _logger);
            var entities = helper.AddUpdateProperties(models);
            var parcels = _mapper.Map<ParcelModel[]>(entities);

            return new JsonResult(parcels);
        }
        #endregion
    }
}