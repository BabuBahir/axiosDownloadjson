module.exports = {

    config : {
        headers: 
            {
                'X-My-Custom-Header': 'Header-Value',
                accept: 'application/json, text/plain, */*',
                'content-type': 'multipart/form-data',
                'user-agent': 'axios/0.14.0',
                'content-length': '587'
    
            }
      },

    formdata :  {
        "validation_date_from[date]" : "01/05/2017",
        "validation_date_to[date]" :  "01/08/2017",
         "view_name" : "bcsm_search_results",
         "view_display_id" : "notice_search_pane",
         "view_path" : "bcms/search"
    }

      
 }

 