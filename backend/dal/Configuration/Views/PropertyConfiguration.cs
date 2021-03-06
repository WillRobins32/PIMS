using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pims.Dal.Entities;
using System;
using System.Linq;

namespace Pims.Dal.Configuration.Views
{
    /// <summary>
    /// PropertyConfiguration class, provides a way to configure the properties view in the database.
    ///</summary>
    public class PropertyConfiguration : IEntityTypeConfiguration<Entities.Views.Property>
    {
        #region Properties
        public PimsContext Context { get; }
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instance of a PropertyConfiguration object, initializes with specified parameters.
        /// </summary>
        /// <param name="context"></param>
        public PropertyConfiguration(PimsContext context)
        {
            this.Context = context;
        }
        #endregion

        #region Methods
        public virtual void Configure(EntityTypeBuilder<Entities.Views.Property> builder)
        {
            if (!this.Context.Database.IsInMemory())
            {
                builder.ToView("View_Properties");
                builder.HasNoKey();
            }
            else
            {
                // This is required to support unit-testing the view in the InMemory database.
                builder
                    .HasNoKey()
                    .ToQuery(() => (
                        from b in this.Context.Buildings
                        select new Entities.Views.Property()
                        {
                            Id = b.Id,
                            PropertyTypeId = PropertyTypes.Building,
                            ClassificationId = b.ClassificationId,
                            Classification = b.Classification.Name,
                            Name = b.Name,
                            Description = b.Description,
                            IsSensitive = b.IsSensitive,
                            IsVisibleToOtherAgencies = b.IsVisibleToOtherAgencies,
                            Latitude = b.Latitude,
                            Longitude = b.Longitude,

                            Municipality = b.Parcel.Municipality,
                            Address = $"{b.Address.Address1} {b.Address.Address2})".Trim(),
                            City = b.Address.City.Name,
                            Province = b.Address.Province.Name,
                            Postal = b.Address.Postal,

                            AgencyId = b.AgencyId,
                            Agency = b.Agency.ParentId.HasValue ? b.Agency.Parent.Name : b.Agency.Name,
                            AgencyCode = b.Agency.ParentId.HasValue ? b.Agency.Parent.Code : b.Agency.Code,
                            SubAgency = b.Agency.ParentId.HasValue ? null : b.Agency.Name,
                            SubAgencyCode = b.Agency.ParentId.HasValue ? null : b.Agency.Code,

                            Estimated = b.Fiscals.Any(f => f.Key == FiscalKeys.Estimated) ? b.Fiscals.OrderByDescending(f => f.FiscalYear).FirstOrDefault(f => f.Key == FiscalKeys.Estimated).Value : 0,
                            EstimatedFiscalYear = b.Fiscals.Any(f => f.Key == FiscalKeys.Estimated) ? b.Fiscals.OrderByDescending(f => f.FiscalYear).FirstOrDefault(f => f.Key == FiscalKeys.Estimated).FiscalYear : (int?)null,
                            NetBook = b.Fiscals.Any(f => f.Key == FiscalKeys.NetBook) ? b.Fiscals.OrderByDescending(f => f.FiscalYear).FirstOrDefault(f => f.Key == FiscalKeys.NetBook).Value : 0,
                            NetBookFiscalYear = b.Fiscals.Any(f => f.Key == FiscalKeys.NetBook) ? b.Fiscals.OrderByDescending(f => f.FiscalYear).FirstOrDefault(f => f.Key == FiscalKeys.NetBook).FiscalYear : (int?)null,
                            Assessed = b.Evaluations.Any(f => f.Key == EvaluationKeys.Assessed) ? b.Evaluations.OrderByDescending(f => f.Date).FirstOrDefault(f => f.Key == EvaluationKeys.Assessed).Value : 0,
                            AssessedDate = b.Evaluations.Any(f => f.Key == EvaluationKeys.Assessed) ? b.Evaluations.OrderByDescending(f => f.Date).FirstOrDefault(f => f.Key == EvaluationKeys.Assessed).Date : (DateTime?)null,
                            Appraised = b.Evaluations.Any(f => f.Key == EvaluationKeys.Appraised) ? b.Evaluations.OrderByDescending(f => f.Date).FirstOrDefault(f => f.Key == EvaluationKeys.Appraised).Value : 0,
                            AppraisedDate = b.Evaluations.Any(f => f.Key == EvaluationKeys.Appraised) ? b.Evaluations.OrderByDescending(f => f.Date).FirstOrDefault(f => f.Key == EvaluationKeys.Appraised).Date : (DateTime?)null,

                            RentableArea = b.RentableArea,
                            BuildingFloorCount = b.BuildingFloorCount,
                            BuildingConstructionTypeId = b.BuildingConstructionTypeId,
                            BuildingConstructionType = b.BuildingConstructionType.Name,
                            BuildingOccupantTypeId = b.BuildingOccupantTypeId,
                            BuildingOccupantType = b.BuildingOccupantType.Name,
                            BuildingPredominateUseId = b.BuildingPredominateUseId,
                            BuildingPredominateUse = b.BuildingPredominateUse.Name,
                            BuildingTenancy = b.BuildingTenancy,

                            PID = b.Parcel.PID,
                            PIN = b.Parcel.PIN,
                            Zoning = b.Parcel.Zoning,
                            ZoningPotential = b.Parcel.ZoningPotential,
                            LandArea = b.Parcel.LandArea,
                            LandLegalDescription = b.Parcel.LandLegalDescription
                        })
                        .Union(
                            from p in this.Context.Parcels
                            select new Entities.Views.Property()
                            {
                                Id = p.Id,
                                PropertyTypeId = PropertyTypes.Land,
                                ClassificationId = p.ClassificationId,
                                Classification = p.Classification.Name,
                                Name = p.Name,
                                Description = p.Description,
                                IsSensitive = p.IsSensitive,
                                IsVisibleToOtherAgencies = p.IsVisibleToOtherAgencies,
                                Latitude = p.Latitude,
                                Longitude = p.Longitude,

                                Municipality = p.Municipality,
                                Address = $"{p.Address.Address1} {p.Address.Address2})".Trim(),
                                City = p.Address.City.Name,
                                Province = p.Address.Province.Name,
                                Postal = p.Address.Postal,

                                AgencyId = p.AgencyId,
                                Agency = p.Agency.ParentId.HasValue ? p.Agency.Parent.Name : p.Agency.Name,
                                AgencyCode = p.Agency.ParentId.HasValue ? p.Agency.Parent.Code : p.Agency.Code,
                                SubAgency = p.Agency.ParentId.HasValue ? null : p.Agency.Name,
                                SubAgencyCode = p.Agency.ParentId.HasValue ? null : p.Agency.Code,

                                Estimated = p.Fiscals.Any(f => f.Key == FiscalKeys.Estimated) ? p.Fiscals.OrderByDescending(f => f.FiscalYear).FirstOrDefault(f => f.Key == FiscalKeys.Estimated).Value : 0,
                                EstimatedFiscalYear = p.Fiscals.Any(f => f.Key == FiscalKeys.Estimated) ? p.Fiscals.OrderByDescending(f => f.FiscalYear).FirstOrDefault(f => f.Key == FiscalKeys.Estimated).FiscalYear : (int?)null,
                                NetBook = p.Fiscals.Any(f => f.Key == FiscalKeys.NetBook) ? p.Fiscals.OrderByDescending(f => f.FiscalYear).FirstOrDefault(f => f.Key == FiscalKeys.NetBook).Value : 0,
                                NetBookFiscalYear = p.Fiscals.Any(f => f.Key == FiscalKeys.NetBook) ? p.Fiscals.OrderByDescending(f => f.FiscalYear).FirstOrDefault(f => f.Key == FiscalKeys.NetBook).FiscalYear : (int?)null,
                                Assessed = p.Evaluations.Any(f => f.Key == EvaluationKeys.Assessed) ? p.Evaluations.OrderByDescending(f => f.Date).FirstOrDefault(f => f.Key == EvaluationKeys.Assessed).Value : 0,
                                AssessedDate = p.Evaluations.Any(f => f.Key == EvaluationKeys.Assessed) ? p.Evaluations.OrderByDescending(f => f.Date).FirstOrDefault(f => f.Key == EvaluationKeys.Assessed).Date : (DateTime?)null,
                                Appraised = p.Evaluations.Any(f => f.Key == EvaluationKeys.Appraised) ? p.Evaluations.OrderByDescending(f => f.Date).FirstOrDefault(f => f.Key == EvaluationKeys.Appraised).Value : 0,
                                AppraisedDate = p.Evaluations.Any(f => f.Key == EvaluationKeys.Appraised) ? p.Evaluations.OrderByDescending(f => f.Date).FirstOrDefault(f => f.Key == EvaluationKeys.Appraised).Date : (DateTime?)null,

                                RentableArea = 0,
                                BuildingFloorCount = 0,
                                BuildingConstructionTypeId = 0,
                                BuildingConstructionType = null,
                                BuildingOccupantTypeId = 0,
                                BuildingOccupantType = null,
                                BuildingPredominateUseId = 0,
                                BuildingPredominateUse = null,
                                BuildingTenancy = null,

                                PID = p.PID,
                                PIN = p.PIN,
                                Zoning = p.Zoning,
                                ZoningPotential = p.ZoningPotential,
                                LandArea = p.LandArea,
                                LandLegalDescription = p.LandLegalDescription
                            }
                        ));
            }
        }
        #endregion
    }
}
