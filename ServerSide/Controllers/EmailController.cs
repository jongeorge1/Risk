﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using ServerSide.Mailers;

namespace ServerSide.Controllers
{
    using System.Configuration;
    using System.IO;
    using System.Web;
    using System.Web.Mvc;
    using PdfGen;

    using ServerSide.Infrastructure;
    using ServerSide.Models;
    using System.Web.Script.Serialization;
    using Winnovative.WnvHtmlConvert;

    public class EmailController : ApiController
    {
        private IPdfGenerationQueue _pdfGenerationQueue;

        public EmailController()
        {
            this._pdfGenerationQueue = PdfGenerationQueue.Instance;
        }

        [System.Web.Http.HttpGet]
        public HttpResponseMessage Send([FromUri]Task task, [FromUri]List<Assessment> assessments )
        {
            var request = new PdfGenerationRequest(task, assessments);
            this._pdfGenerationQueue.Enqueue(request);
            return new HttpResponseMessage(HttpStatusCode.OK);
        }
    }
}
