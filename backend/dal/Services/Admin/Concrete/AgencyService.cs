using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Pims.Core.Extensions;
using Pims.Dal.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;

namespace Pims.Dal.Services.Admin
{
    /// <summary>
    /// AgencyService class, provides a service layer to administrate agencies within the datasource.
    /// </summary>
    public class AgencyService : BaseService<Agency>, IAgencyService
    {
        #region Variables
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a AgencyService, and initializes it with the specified arguments.
        /// </summary>
        /// <param name="dbContext"></param>
        /// <param name="user"></param>
        /// <param name="service"></param>
        /// <param name="logger"></param>
        public AgencyService(PimsContext dbContext, ClaimsPrincipal user, IPimsService service, ILogger<AgencyService> logger) : base(dbContext, user, service, logger) { }
        #endregion

        #region Methods
        /// <summary>
        /// Get a page of agencies from the datasource.
        /// </summary>
        /// <param name="page"></param>
        /// <param name="quantity"></param>
        /// <param name="sort"></param>
        /// <returns></returns>
        public IEnumerable<Agency> GetAll()
        {
            return this.Context.Agencies.AsNoTracking().OrderBy(p => p.Name).ToArray();
        }

        /// <summary>
        /// Get the agency for the specified 'id'.
        /// </summary>
        /// <param name="id"></param>
        /// <exception cref="KeyNotFoundException">Agency does not exists for the specified 'id'.</exception>
        /// <returns></returns>
        public Agency Get(int id)
        {
            return this.Context.Agencies.Find(id) ?? throw new KeyNotFoundException();
        }

        /// <summary>
        /// Updates the specified agency in the datasource.
        /// </summary>
        /// <param name="entity"></param>
        /// <exception type="KeyNotFoundException">Entity does not exist in the datasource.</exception>
        /// <returns></returns>
        public override void Update(Agency entity)
        {
            entity.ThrowIfNull(nameof(entity));

            var agency = this.Context.Agencies.Find(entity.Id) ?? throw new KeyNotFoundException();

            this.Context.Entry(agency).CurrentValues.SetValues(entity);
            base.Update(agency);
        }

        /// <summary>
        /// Remove the specified agency from the datasource.
        /// </summary>
        /// <exception type="KeyNotFoundException">Entity does not exist in the datasource.</exception>
        /// <param name="entity"></param>
        public override void Remove(Agency entity)
        {
            entity.ThrowIfNull(nameof(entity));

            var agency = this.Context.Agencies.Find(entity.Id) ?? throw new KeyNotFoundException();

            this.Context.Entry(agency).CurrentValues.SetValues(entity);
            base.Remove(agency);
        }
        #endregion
    }
}
