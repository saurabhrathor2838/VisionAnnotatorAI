import { useEffect, useState } from "react";

function AnnotationProperties({
  selectedAnnotation,
  annotations,
  setAnnotations,
  setSelectedAnnotation,

  labelSettings,
  setLabelSettings,
}) {

  const [formData, setFormData] = useState(null);


  useEffect(() => {

    setFormData(selectedAnnotation);

  }, [selectedAnnotation]);


  if (!selectedAnnotation || !formData) {
    return (
      <div>
        Select annotation
      </div>
    );
  }


  const handleChange = (field, value) => {

    const updated = {
      ...formData,
      [field]: value,
    };


    setFormData(updated);


    const updatedAnnotations = annotations.map((item) =>
      item.id === updated.id
        ? updated
        : item
    );


    setAnnotations(updatedAnnotations);

    setSelectedAnnotation(updated);

  };


  return (
    <div>

      <h3>Annotation Properties</h3>


      <p>
        <strong>ID:</strong> {formData.id}
      </p>


      <label>
        Object Name
      </label>

      <input
        value={formData.objectName || ""}
        onChange={(e)=>
          handleChange(
            "objectName",
            e.target.value
          )
        }
      />


      <br/><br/>


      <label>
        Status
      </label>

      <input
        value={formData.status || ""}
        onChange={(e)=>
          handleChange(
            "status",
            e.target.value
          )
        }
      />


      <br/><br/>


      <label>
        Level
      </label>

      <input
        value={formData.level || ""}
        onChange={(e)=>
          handleChange(
            "level",
            e.target.value
          )
        }
      />


      <br/><br/>


      <label>
        Caption
      </label>

      <textarea

        value={formData.caption || ""}

        onChange={(e)=>
          handleChange(
            "caption",
            e.target.value
          )
        }

      />


      <br/><br/>


      <label>
        Environment
      </label>

      <input

        value={formData.environment || ""}

        onChange={(e)=>
          handleChange(
            "environment",
            e.target.value
          )
        }

      />


      <br/><br/>


      <label>
        Context
      </label>

      <input

        value={formData.context || ""}

        onChange={(e)=>
          handleChange(
            "context",
            e.target.value
          )
        }

      />
            <br/><br/>

            <hr/>

            <h3>
              Label Display
            </h3>


            <label>

            <input
            type="checkbox"

            checked={
            labelSettings.fields.objectName
            }

            onChange={(e)=>

            setLabelSettings({

            ...labelSettings,

            fields:{
              ...labelSettings.fields,

              objectName:e.target.checked
            }

            })

            }

            />

            Object Name

            </label>



            <br/>


            <label>

            <input
            type="checkbox"

            checked={
            labelSettings.fields.status
            }

            onChange={(e)=>

            setLabelSettings({

            ...labelSettings,

            fields:{
              ...labelSettings.fields,

              status:e.target.checked
            }

            })

            }

            />

            Status

            </label>



            <br/>


            <label>

            <input
            type="checkbox"

            checked={
            labelSettings.fields.environment
            }

            onChange={(e)=>

            setLabelSettings({

            ...labelSettings,

            fields:{
              ...labelSettings.fields,

              environment:e.target.checked
            }

            })

            }

            />

            Environment

            </label>



            <br/>


            <label>

            <input
            type="checkbox"

            checked={
            labelSettings.fields.context
            }

            onChange={(e)=>

            setLabelSettings({

            ...labelSettings,

            fields:{
              ...labelSettings.fields,

              context:e.target.checked
            }

            })

            }

            />

            Context

            </label>


            <br/><br/>


            <label>
            Position
            </label>


            <select

            value={labelSettings.position}

            onChange={(e)=>

            setLabelSettings({

            ...labelSettings,

            position:e.target.value

            })

            }

            >


            <option value="top-left">
            Top Left
            </option>


            <option value="top-right">
            Top Right
            </option>


            <option value="center">
            Center
            </option>


            <option value="bottom">
            Bottom
            </option>


            </select>

                </div>
              );
            }


            export default AnnotationProperties;