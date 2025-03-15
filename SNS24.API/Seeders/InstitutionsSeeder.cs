using SNS24.WebApi.Data;
using SNS24.WebApi.Models;
using SNS24.WebApi.Models.Common;

public static class InstitutionSeeder
{
    public static void Seed(ApplicationDbContext context)
    {
        if (!context.Institutions.Any())
        {
            var institutions = new List<Institution>
            {
                // Public Institution (SNS)
                new Institution
                {
                    Name = "SNS - Serviço Nacional de Saúde",
                    Address = new Address
                    {
                        Street = "Avenida da Liberdade",
                        City = "Lisboa",
                        State = "Lisboa",
                        PostalCode = "1250-144",
                        Country = "Portugal"
                    },
                    PhoneNumber = "210123456",
                    IsPublicSector = true
                },

                // Private Institutions
                new Institution
                {
                    Name = "Hospital Privado da Luz",
                    Address = new Address
                    {
                        Street = "Rua Carlos Reis",
                        City = "Lisboa",
                        State = "Lisboa",
                        PostalCode = "1000-200",
                        Country = "Portugal"
                    },
                    PhoneNumber = "211987654",
                    IsPublicSector = false
                },
                new Institution
                {
                    Name = "Clínica Privada Porto Saúde",
                    Address = new Address
                    {
                        Street = "Rua de Santa Catarina",
                        City = "Porto",
                        State = "Porto",
                        PostalCode = "4000-123",
                        Country = "Portugal"
                    },
                    PhoneNumber = "220765432",
                    IsPublicSector = false
                },
                new Institution
                {
                    Name = "Clínica Coimbra Premium",
                    Address = new Address
                    {
                        Street = "Avenida Sá da Bandeira",
                        City = "Coimbra",
                        State = "Coimbra",
                        PostalCode = "3000-456",
                        Country = "Portugal"
                    },
                    PhoneNumber = "239654321",
                    IsPublicSector = false
                },
                new Institution
                {
                    Name = "Hospital Privado Algarve Saúde",
                    Address = new Address
                    {
                        Street = "Rua de São Lourenço",
                        City = "Faro",
                        State = "Algarve",
                        PostalCode = "8000-789",
                        Country = "Portugal"
                    },
                    PhoneNumber = "289876543",
                    IsPublicSector = false
                },
                new Institution
                {
                    Name = "Hospital Privado Braga Saúde",
                    Address = new Address
                    {
                        Street = "Rua Dom Frei Caetano Brandão",
                        City = "Braga",
                        State = "Braga",
                        PostalCode = "4700-321",
                        Country = "Portugal"
                    },
                    PhoneNumber = "253987654",
                    IsPublicSector = false
                },
                new Institution
                {
                    Name = "Clínica Privada Saúde Évora",
                    Address = new Address
                    {
                        Street = "Rua do Raimundo",
                        City = "Évora",
                        State = "Évora",
                        PostalCode = "7000-789",
                        Country = "Portugal"
                    },
                    PhoneNumber = "266765432",
                    IsPublicSector = false
                },
                new Institution
                {
                    Name = "Clínica Privada Aveiro Vida",
                    Address = new Address
                    {
                        Street = "Rua Direita",
                        City = "Aveiro",
                        State = "Aveiro",
                        PostalCode = "3800-654",
                        Country = "Portugal"
                    },
                    PhoneNumber = "234876543",
                    IsPublicSector = false
                },
                new Institution
                    
                {
                    Name = "Clínica Privada Leiria Saúde",
                    Address = new Address
                    {
                        Street = "Rua da Saudade",
                        City = "Leiria",
                        State = "Leiria",
                        PostalCode = "2400-987",
                        Country = "Portugal"
                    },
                    PhoneNumber = "244765432",
                    IsPublicSector = false
                },
                new Institution
                {
                    Name = "Hospital Privado Madeira Saúde",
                    Address = new Address
                    {
                        Street = "Avenida do Mar",
                        City = "Funchal",
                        State = "Madeira",
                        PostalCode = "9000-111",
                        Country = "Portugal"
                    },
                    PhoneNumber = "291876543",
                    IsPublicSector = false
                }
            };

            context.Institutions.AddRange(institutions);
            context.SaveChanges();
        }
    }
}