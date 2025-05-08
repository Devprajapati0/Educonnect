 const fileFormat =(url="")=>{
    const file = url.split(".").pop();
    if(file === "mp4" || file === "webm"||file=="mov" || file === "ogg"){return "video"}
    if(file === "mp3" || file === "wav" || file === "ogg"){return "audio"}
    if(file === "jpg" || file === "jpeg" || file === "png" || file === "gif"){return "image"}
    if(file === "pdf"){return "pdf"}
    return "file"
}


const RenderAttachment = (file,url) => {

    switch (file) {
      case "image":
        return (
            <img
              src={url}
              alt="Attachment"
              style={{ maxWidth: "100px", borderRadius: "5px" }}
              />
      
          );
      case "audio":
          return (
              <audio controls>
              <source src={url} type="audio/mpeg" />
              Your browser does not support the audio element.
              </audio>
          );
      case "video": 
          return (
              <video width="320" height="240" controls>
              <source src={url} type="video/mp4" />
              Your browser does not support the video tag.
              </video>
          );
      case "raw":
          return (
       
              <img
                  src={url}
                  alt="Attachment"
                  style={{ maxWidth: "100px", borderRadius: "5px" }}
              />
             
          );
          case "file":
          return (
  
              <img
                  src={url}
                  alt="Attachment"
                  style={{ maxWidth: "100px", borderRadius: "5px" }}
              />
              
          );
      default:
          return (
  
              <img
                  src={url}
                  alt="Attachment"
                  style={{ maxWidth: "100px", borderRadius: "5px" }}
              />
           
          );
  
  }}
  
  export { RenderAttachment,fileFormat};