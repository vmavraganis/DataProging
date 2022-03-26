const { string } = require('joi');
const Joi = require('joi');
const regions = [
    "Rest",
"Europe",
"Oceania",
"Americas",
"Africa",
"Asia",
]
const schema = Joi.object({
    id: Joi.number().optional(),
    country: Joi.number().optional(),
    region: Joi.string().optional().valid(...regions),
    genre: Joi.number().optional(),
    name: Joi.string().optional(),
    progarchivesid: Joi.number().optional(),
    orderBy:Joi.string().valid("id","country","genre","name","progarchivesid"),
    includeBio:Joi.boolean().optional(),
    includeRecords:Joi.boolean().optional()
        
})

.when(
    Joi.object({ id: Joi.exist() })
    .unknown(), 
    {
        then: Joi.object({
            id: Joi.number()
            .min(1)
            .max(100000)
        })
        .xor("country","id")
        .xor("region","id")
        .xor("genre","id")
        .xor("name","id")
        .xor("progarchivesid","id")
      
        ,
        otherwise: Joi.object({
            
            country: Joi.number()
                     .min(1)
                     .max(200),
            genre: Joi.number()
                     .min(1)
                     .max(50),
            progarchivesid: Joi.number()
                     .min(1)
                     .max(20000),
        }
)
    })











    


    module.exports.schema = schema