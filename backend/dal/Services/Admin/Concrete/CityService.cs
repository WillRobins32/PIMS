using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Pims.Core.Extensions;
using Pims.Dal.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;

namespace Pims.Dal.Services.Admin
{
    /// <summary>
    /// CityService class, provides a service layer to administrate citys within the datasource.
    /// </summary>
    public class CityService : BaseService<City>, ICityService
    {
        #region Variables
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a CityService, and initializes it with the specified arguments.
        /// </summary>
        /// <param name="dbContext"></param>
        /// <param name="user"></param>
        /// <param name="service"></param>
        /// <param name="logger"></param>
        public CityService(PimsContext dbContext, ClaimsPrincipal user, IPimsService service, ILogger<CityService> logger) : base(dbContext, user, service, logger) { }
        #endregion

        #region Methods
        /// <summary>
        /// Get a page of citys from the datasource.
        /// </summary>
        /// <param name="page"></param>
        /// <param name="quantity"></param>
        /// <param name="sort"></param>
        /// <returns></returns>
        public IEnumerable<City> Get(string name)
        {
            var query = this.Context.Cities.AsNoTracking();

            if (!String.IsNullOrWhiteSpace(name))
                query = query.Where(c => name.StartsWith(name));

            return query.OrderBy(c => c.SortOrder).ThenBy(c => c.Name).ToArray();
        }

        /// <summary>
        /// Get all cities from the datasource. // TODO: This needs to be filtered by province at some point.
        /// </summary>
        /// <returns></returns>
        public IEnumerable<City> GetAll()
        {
            return this.Context.Cities.OrderBy(c => c.SortOrder).ThenBy(c => c.Name).ToArray();
        }

        /// <summary>
        /// Updates the specified city in the datasource.
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        public override void Update(City entity)
        {
            entity.ThrowIfNull(nameof(entity));

            var city = this.Context.Cities.Find(entity.Id);
            if (city == null) throw new KeyNotFoundException();

            this.Context.Entry(city).CurrentValues.SetValues(entity);
            base.Update(city);
        }

        /// <summary>
        /// Remove the specified city from the datasource.
        /// </summary>
        /// <param name="entity"></param>
        public override void Remove(City entity)
        {
            entity.ThrowIfNull(nameof(entity));

            var city = this.Context.Cities.Find(entity.Id);
            if (city == null) throw new KeyNotFoundException();

            this.Context.Entry(city).CurrentValues.SetValues(entity);
            base.Remove(city);
        }
        #endregion
    }
}
