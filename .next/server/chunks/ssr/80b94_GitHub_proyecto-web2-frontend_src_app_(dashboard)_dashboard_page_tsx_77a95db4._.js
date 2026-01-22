module.exports=[76732,a=>{"use strict";var b=a.i(57692),c=a.i(98620);a.i(67360);var d=a.i(4656),e=a.i(91587),f=a.i(21652),g=a.i(34680);let h={async getEstadisticas(){let{data:a}=await f.apiClient.get(g.API_ENDPOINTS.dashboard.estadisticas);return a},async getCursosActivos(){let{data:a}=await f.apiClient.get(g.API_ENDPOINTS.dashboard.cursosActivos);return a},async getInscripcionesRecientes(){let{data:a}=await f.apiClient.get(g.API_ENDPOINTS.dashboard.inscripcionesRecientes);return a},async getFacturacionMensual(){let{data:a}=await f.apiClient.get(g.API_ENDPOINTS.dashboard.facturacionMensual);return a},async getMisDatos(){let{data:a}=await f.apiClient.get(g.API_ENDPOINTS.dashboard.misDatos);return a},async getParticipantes(a){let{data:b}=await f.apiClient.get(g.API_ENDPOINTS.dashboard.participantes,{limit:a});return b},async getReporteCursos(a){let{data:b}=await f.apiClient.get("/dashboard/reporte/cursos",a);return b},async getReporteFinanzas(a){let{data:b}=await f.apiClient.get("/dashboard/reporte/finanzas",a);return b},async getReporteParticipantes(a){let{data:b}=await f.apiClient.get("/dashboard/reporte/participantes",a);return b}};var i=a.i(82886),j=a.i(86993),k=a.i(97422),l=a.i(17229),m=a.i(65857);let n=c.forwardRef(function({title:a,titleId:b,...d},e){return c.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:e,"aria-labelledby":b},d),a?c.createElement("title",{id:b},a):null,c.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"}))});var o=a.i(14442),p=a.i(57884),q=a.i(23849);let r=c.forwardRef(function({title:a,titleId:b,...d},e){return c.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:e,"aria-labelledby":b},d),a?c.createElement("title",{id:b},a):null,c.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"}))});var s=a.i(26324);function t(){let{user:a,isLoading:f}=(0,e.useAuth)(),g=a?.rol?.slug||"",[t,u]=(0,c.useState)(null),[v,w]=(0,c.useState)([]),[x,y]=(0,c.useState)([]),[z,A]=(0,c.useState)([]),[B,C]=(0,c.useState)(null),[D,E]=(0,c.useState)(!0),[F,G]=(0,c.useState)(""),[H,I]=(0,c.useState)(""),[J,K]=(0,c.useState)(!1),L=(0,c.useCallback)(async()=>{try{if("administrador"===g){let[a,b,c,d]=await Promise.all([h.getEstadisticas().catch(()=>null),h.getCursosActivos().catch(()=>[]),h.getInscripcionesRecientes().catch(()=>[]),h.getParticipantes(10).catch(()=>[])]);u(a),w(b),y(c),A(d)}else if("instructor"===g||"tutor"===g){let a=await h.getMisDatos().catch(()=>null);C(a)}}catch(a){console.error("Error loading dashboard:",a)}finally{E(!1)}},[g]);(0,c.useEffect)(()=>{g?L():f||E(!1)},[L,g,f]);let M=new Date().toLocaleDateString("es-EC",{weekday:"long",year:"numeric",month:"long",day:"numeric",timeZone:"America/Guayaquil"}),N=async()=>{K(!0);try{let a=await h.getReporteCursos({fecha_desde:F||void 0,fecha_hasta:H||void 0}),b=`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Reporte de Cursos</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 30px; color: #333; font-size: 12px; }
            .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #4f46e5; padding-bottom: 15px; }
            .header h1 { color: #4f46e5; margin: 0; font-size: 22px; }
            .header p { margin: 5px 0; color: #666; font-size: 11px; }
            .resumen { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 20px; }
            .resumen-item { background: #f3f4f6; padding: 10px; border-radius: 6px; text-align: center; }
            .resumen-item .valor { font-size: 20px; font-weight: bold; color: #4f46e5; }
            .resumen-item .label { font-size: 10px; color: #6b7280; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            th, td { border: 1px solid #e5e7eb; padding: 8px; text-align: left; }
            th { background: #f9fafb; font-weight: 600; font-size: 11px; }
            td { font-size: 11px; }
            .estado { padding: 2px 8px; border-radius: 10px; font-size: 10px; }
            .estado-abierto { background: #d1fae5; color: #065f46; }
            .estado-en_proceso { background: #dbeafe; color: #1e40af; }
            .estado-cerrado { background: #f3f4f6; color: #374151; }
            .footer { margin-top: 20px; text-align: center; font-size: 10px; color: #9ca3af; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>REPORTE DE CURSOS</h1>
            <p>Cursos Vacacionales</p>
            ${F||H?`<p>Per\xedodo: ${F||"Inicio"} - ${H||"Actual"}</p>`:""}
          </div>
          
          <div class="resumen">
            <div class="resumen-item">
              <div class="valor">${a.resumen.total_cursos}</div>
              <div class="label">Total Cursos</div>
            </div>
            <div class="resumen-item">
              <div class="valor">${a.resumen.cursos_abiertos}</div>
              <div class="label">Abiertos</div>
            </div>
            <div class="resumen-item">
              <div class="valor">${a.resumen.cursos_en_proceso}</div>
              <div class="label">En Proceso</div>
            </div>
            <div class="resumen-item">
              <div class="valor">${a.resumen.total_grupos}</div>
              <div class="label">Total Grupos</div>
            </div>
            <div class="resumen-item">
              <div class="valor">${a.resumen.total_inscripciones}</div>
              <div class="label">Total Inscripciones</div>
            </div>
            <div class="resumen-item">
              <div class="valor">${a.resumen.cursos_cerrados}</div>
              <div class="label">Cerrados</div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>Estado</th>
                <th>Fecha Inicio</th>
                <th>Fecha Fin</th>
                <th>Precio</th>
                <th>Cupo</th>
                <th>Grupos</th>
                <th>Inscritos</th>
              </tr>
            </thead>
            <tbody>
              ${a.cursos.map(a=>`
                <tr>
                  <td>${a.nombre}</td>
                  <td>${a.tipo||"-"}</td>
                  <td><span class="estado estado-${a.estado}">${a.estado}</span></td>
                  <td>${a.fecha_inicio||"-"}</td>
                  <td>${a.fecha_fin||"-"}</td>
                  <td>$${Number(a.precio||0).toFixed(2)}</td>
                  <td>${a.cupo_actual}/${a.cupo_maximo}</td>
                  <td>${a.grupos_count}</td>
                  <td>${a.inscripciones_count}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>

          <div class="footer">
            <p>Generado el ${new Date().toLocaleDateString("es-EC",{timeZone:"America/Guayaquil"})} a las ${new Date().toLocaleTimeString("es-EC",{timeZone:"America/Guayaquil"})}</p>
          </div>
        </body>
        </html>
      `,c=window.open("","_blank");c&&(c.document.write(b),c.document.close(),c.print())}catch(a){console.error("Error generando reporte:",a)}finally{K(!1)}},O=async()=>{K(!0);try{let a=await h.getReporteFinanzas({fecha_desde:F||void 0,fecha_hasta:H||void 0}),b=`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Reporte de Finanzas</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 30px; color: #333; font-size: 12px; }
            .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #059669; padding-bottom: 15px; }
            .header h1 { color: #059669; margin: 0; font-size: 22px; }
            .header p { margin: 5px 0; color: #666; font-size: 11px; }
            .resumen { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 20px; }
            .resumen-item { background: #f3f4f6; padding: 10px; border-radius: 6px; text-align: center; }
            .resumen-item .valor { font-size: 18px; font-weight: bold; color: #059669; }
            .resumen-item .label { font-size: 10px; color: #6b7280; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            th, td { border: 1px solid #e5e7eb; padding: 8px; text-align: left; }
            th { background: #f9fafb; font-weight: 600; font-size: 11px; }
            td { font-size: 11px; }
            .estado { padding: 2px 8px; border-radius: 10px; font-size: 10px; }
            .estado-pagada { background: #d1fae5; color: #065f46; }
            .estado-pendiente { background: #fef3c7; color: #92400e; }
            .estado-vencida { background: #fee2e2; color: #991b1b; }
            .footer { margin-top: 20px; text-align: center; font-size: 10px; color: #9ca3af; }
            .text-right { text-align: right; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>REPORTE DE FINANZAS</h1>
            <p>Cursos Vacacionales</p>
            ${F||H?`<p>Per\xedodo: ${F||"Inicio"} - ${H||"Actual"}</p>`:""}
          </div>
          
          <div class="resumen">
            <div class="resumen-item">
              <div class="valor">${a.resumen.total_facturas}</div>
              <div class="label">Total Facturas</div>
            </div>
            <div class="resumen-item">
              <div class="valor">$${Number(a.resumen.total_facturado||0).toFixed(2)}</div>
              <div class="label">Total Facturado</div>
            </div>
            <div class="resumen-item">
              <div class="valor">$${Number(a.resumen.total_pagado||0).toFixed(2)}</div>
              <div class="label">Total Pagado</div>
            </div>
            <div class="resumen-item">
              <div class="valor">$${Number(a.resumen.total_pendiente||0).toFixed(2)}</div>
              <div class="label">Total Pendiente</div>
            </div>
            <div class="resumen-item">
              <div class="valor">${a.resumen.facturas_pagadas}</div>
              <div class="label">Facturas Pagadas</div>
            </div>
            <div class="resumen-item">
              <div class="valor">${a.resumen.facturas_pendientes}</div>
              <div class="label">Facturas Pendientes</div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>N\xfamero</th>
                <th>Cliente</th>
                <th>Concepto</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th class="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              ${a.facturas.map(a=>`
                <tr>
                  <td>${a.numero||"-"}</td>
                  <td>${a.cliente}</td>
                  <td>${a.concepto||"-"}</td>
                  <td>${a.fecha_emision||"-"}</td>
                  <td><span class="estado estado-${a.estado}">${a.estado}</span></td>
                  <td class="text-right">$${Number(a.total||0).toFixed(2)}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>

          <div class="footer">
            <p>Generado el ${new Date().toLocaleDateString("es-EC",{timeZone:"America/Guayaquil"})} a las ${new Date().toLocaleTimeString("es-EC",{timeZone:"America/Guayaquil"})}</p>
          </div>
        </body>
        </html>
      `,c=window.open("","_blank");c&&(c.document.write(b),c.document.close(),c.print())}catch(a){console.error("Error generando reporte:",a)}finally{K(!1)}},P=async()=>{K(!0);try{let a=await h.getReporteParticipantes({fecha_desde:F||void 0,fecha_hasta:H||void 0}),b=`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Reporte de Participantes</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 30px; color: #333; font-size: 12px; }
            .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #7c3aed; padding-bottom: 15px; }
            .header h1 { color: #7c3aed; margin: 0; font-size: 22px; }
            .header p { margin: 5px 0; color: #666; font-size: 11px; }
            .resumen { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 20px; }
            .resumen-item { background: #f3f4f6; padding: 10px; border-radius: 6px; text-align: center; }
            .resumen-item .valor { font-size: 20px; font-weight: bold; color: #7c3aed; }
            .resumen-item .label { font-size: 10px; color: #6b7280; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            th, td { border: 1px solid #e5e7eb; padding: 8px; text-align: left; }
            th { background: #f9fafb; font-weight: 600; font-size: 11px; }
            td { font-size: 11px; }
            .estado { padding: 2px 8px; border-radius: 10px; font-size: 10px; }
            .estado-activo { background: #d1fae5; color: #065f46; }
            .estado-inactivo { background: #f3f4f6; color: #374151; }
            .footer { margin-top: 20px; text-align: center; font-size: 10px; color: #9ca3af; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>REPORTE DE PARTICIPANTES</h1>
            <p>Cursos Vacacionales</p>
            ${F||H?`<p>Per\xedodo: ${F||"Inicio"} - ${H||"Actual"}</p>`:""}
          </div>
          
          <div class="resumen">
            <div class="resumen-item">
              <div class="valor">${a.resumen.total_participantes}</div>
              <div class="label">Total Participantes</div>
            </div>
            <div class="resumen-item">
              <div class="valor">${a.resumen.participantes_activos}</div>
              <div class="label">Activos</div>
            </div>
            <div class="resumen-item">
              <div class="valor">${a.resumen.participantes_inactivos}</div>
              <div class="label">Inactivos</div>
            </div>
            <div class="resumen-item">
              <div class="valor">${a.resumen.con_inscripciones}</div>
              <div class="label">Con Inscripciones</div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>C\xe9dula</th>
                <th>Edad</th>
                <th>G\xe9nero</th>
                <th>Categor\xeda</th>
                <th>Tutor</th>
                <th>Inscripciones</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              ${a.participantes.map(a=>`
                <tr>
                  <td>${a.nombre}</td>
                  <td>${a.cedula||"-"}</td>
                  <td>${a.edad||"-"}</td>
                  <td>${a.genero||"-"}</td>
                  <td>${a.categoria||"-"}</td>
                  <td>${a.tutor||"-"}</td>
                  <td>${a.inscripciones_activas}</td>
                  <td><span class="estado estado-${a.estado}">${a.estado}</span></td>
                </tr>
              `).join("")}
            </tbody>
          </table>

          <div class="footer">
            <p>Generado el ${new Date().toLocaleDateString("es-EC",{timeZone:"America/Guayaquil"})} a las ${new Date().toLocaleTimeString("es-EC",{timeZone:"America/Guayaquil"})}</p>
          </div>
        </body>
        </html>
      `,c=window.open("","_blank");c&&(c.document.write(b),c.document.close(),c.print())}catch(a){console.error("Error generando reporte:",a)}finally{K(!1)}};if(f)return(0,b.jsx)(d.DashboardLayout,{children:(0,b.jsx)("div",{className:"flex justify-center items-center py-20",children:(0,b.jsx)("div",{className:"animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"})})});if("administrador"===g){let a=[{label:"Cursos Abiertos",value:t?.cursos.abiertos||0,total:t?.cursos.total||0,icon:j.AcademicCapIcon,bgColor:"bg-emerald-50",iconColor:"text-emerald-600"},{label:"Inscripciones Activas",value:t?.inscripciones.activas||0,total:t?.inscripciones.este_mes||0,subtitle:"este mes",icon:k.ClipboardDocumentCheckIcon,bgColor:"bg-purple-50",iconColor:"text-purple-600"},{label:"Deportistas",value:t?.deportistas.activos||0,total:t?.deportistas.total||0,icon:i.UserGroupIcon,bgColor:"bg-blue-50",iconColor:"text-blue-600"},{label:"Instructores",value:t?.instructores.activos||0,total:t?.instructores.total||0,icon:n,bgColor:"bg-amber-50",iconColor:"text-amber-600"}];return(0,b.jsx)(d.DashboardLayout,{children:(0,b.jsxs)("div",{className:"space-y-4",children:[(0,b.jsx)("div",{className:"flex items-center justify-between",children:(0,b.jsxs)("div",{children:[(0,b.jsx)("h1",{className:"text-lg font-semibold text-gray-900",children:"Dashboard - Administración"}),(0,b.jsx)("p",{className:"text-xs text-gray-500 capitalize",children:M})]})}),(0,b.jsx)("div",{className:"grid grid-cols-2 lg:grid-cols-4 gap-3",children:a.map(a=>(0,b.jsx)("div",{className:"bg-white rounded-xl border border-gray-100 p-4",children:(0,b.jsxs)("div",{className:"flex items-center gap-3",children:[(0,b.jsx)("div",{className:`p-2 rounded-lg ${a.bgColor}`,children:(0,b.jsx)(a.icon,{className:`h-5 w-5 ${a.iconColor}`})}),(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"text-xs text-gray-500",children:a.label}),(0,b.jsx)("p",{className:"text-xl font-semibold text-gray-900",children:D?"...":a.value}),(0,b.jsx)("p",{className:"text-xs text-gray-400",children:a.subtitle||`de ${a.total} total`})]})]})},a.label))}),(0,b.jsxs)("div",{className:"grid grid-cols-1 lg:grid-cols-2 gap-4",children:[(0,b.jsxs)("div",{className:"bg-white rounded-xl border border-gray-100 p-4",children:[(0,b.jsxs)("div",{className:"flex items-center gap-2 mb-4",children:[(0,b.jsx)(j.AcademicCapIcon,{className:"h-4 w-4 text-gray-400"}),(0,b.jsx)("h2",{className:"text-sm font-medium text-gray-900",children:"Cursos Activos"})]}),D?(0,b.jsx)("div",{className:"flex justify-center py-6",children:(0,b.jsx)("div",{className:"animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"})}):0===v.length?(0,b.jsx)("p",{className:"text-sm text-gray-500 text-center py-6",children:"No hay cursos activos"}):(0,b.jsx)("div",{className:"space-y-2",children:v.map(a=>(0,b.jsxs)("div",{className:"flex items-center justify-between p-3 bg-gray-50 rounded-lg",children:[(0,b.jsxs)("div",{className:"flex-1",children:[(0,b.jsx)("p",{className:"text-sm font-medium text-gray-900",children:a.nombre}),(0,b.jsxs)("p",{className:"text-xs text-gray-500",children:[a.grupos_count," grupos ·"," ",a.inscripciones_count," inscritos"]})]}),(0,b.jsxs)("div",{className:"text-right",children:[(0,b.jsx)("span",{className:`text-xs px-2 py-1 rounded-full ${"abierto"===a.estado?"bg-emerald-50 text-emerald-600":"bg-blue-50 text-blue-600"}`,children:a.estado}),(0,b.jsxs)("div",{className:"mt-1",children:[(0,b.jsx)("div",{className:"w-20 h-1.5 bg-gray-200 rounded-full",children:(0,b.jsx)("div",{className:"h-1.5 bg-green-500 rounded-full",style:{width:`${a.porcentaje_ocupacion}%`}})}),(0,b.jsxs)("p",{className:"text-xs text-gray-400",children:[a.porcentaje_ocupacion,"% ocupado"]})]})]})]},a.id_curso))})]}),(0,b.jsxs)("div",{className:"bg-white rounded-xl border border-gray-100 p-4",children:[(0,b.jsxs)("div",{className:"flex items-center gap-2 mb-4",children:[(0,b.jsx)(k.ClipboardDocumentCheckIcon,{className:"h-4 w-4 text-gray-400"}),(0,b.jsx)("h2",{className:"text-sm font-medium text-gray-900",children:"Inscripciones Recientes"})]}),D?(0,b.jsx)("div",{className:"flex justify-center py-6",children:(0,b.jsx)("div",{className:"animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"})}):0===x.length?(0,b.jsx)("p",{className:"text-sm text-gray-500 text-center py-6",children:"No hay inscripciones recientes"}):(0,b.jsx)("div",{className:"space-y-2",children:x.slice(0,5).map(a=>(0,b.jsxs)("div",{className:"flex items-center justify-between p-3 bg-gray-50 rounded-lg",children:[(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"text-sm font-medium text-gray-900",children:a.deportista||"Sin nombre"}),(0,b.jsxs)("p",{className:"text-xs text-gray-500",children:[a.curso," - ",a.grupo]})]}),(0,b.jsx)("span",{className:`text-xs px-2 py-1 rounded-full ${"activa"===a.estado?"bg-emerald-50 text-emerald-600":"completada"===a.estado?"bg-blue-50 text-blue-600":"bg-gray-100 text-gray-500"}`,children:a.estado})]},a.id_inscripcion))})]})]}),(0,b.jsxs)("div",{className:"bg-white rounded-xl border border-gray-100 p-4",children:[(0,b.jsxs)("div",{className:"flex items-center gap-2 mb-4",children:[(0,b.jsx)(m.UsersIcon,{className:"h-4 w-4 text-gray-400"}),(0,b.jsx)("h2",{className:"text-sm font-medium text-gray-900",children:"Resumen de Grupos"})]}),(0,b.jsxs)("div",{className:"grid grid-cols-3 gap-4 text-center",children:[(0,b.jsxs)("div",{className:"p-3 bg-emerald-50 rounded-lg",children:[(0,b.jsx)("p",{className:"text-2xl font-bold text-emerald-600",children:t?.grupos.activos||0}),(0,b.jsx)("p",{className:"text-xs text-gray-600",children:"Activos"})]}),(0,b.jsxs)("div",{className:"p-3 bg-amber-50 rounded-lg",children:[(0,b.jsx)("p",{className:"text-2xl font-bold text-amber-600",children:t?.grupos.completos||0}),(0,b.jsx)("p",{className:"text-xs text-gray-600",children:"Completos"})]}),(0,b.jsxs)("div",{className:"p-3 bg-gray-100 rounded-lg",children:[(0,b.jsx)("p",{className:"text-2xl font-bold text-gray-600",children:t?.grupos.total||0}),(0,b.jsx)("p",{className:"text-xs text-gray-600",children:"Total"})]})]})]}),(0,b.jsxs)("div",{className:"bg-white rounded-xl border border-gray-100 p-4",children:[(0,b.jsxs)("div",{className:"flex items-center justify-between mb-4",children:[(0,b.jsxs)("div",{className:"flex items-center gap-2",children:[(0,b.jsx)(i.UserGroupIcon,{className:"h-4 w-4 text-gray-400"}),(0,b.jsx)("h2",{className:"text-sm font-medium text-gray-900",children:"Últimos Participantes Registrados"})]}),(0,b.jsx)(s.default,{href:"/deportistas",className:"text-xs text-green-600 hover:text-green-700",children:"Ver todos →"})]}),D?(0,b.jsx)("div",{className:"flex justify-center py-6",children:(0,b.jsx)("div",{className:"animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"})}):0===z.length?(0,b.jsx)("p",{className:"text-sm text-gray-500 text-center py-6",children:"No hay participantes registrados"}):(0,b.jsx)("div",{className:"overflow-x-auto",children:(0,b.jsxs)("table",{className:"min-w-full",children:[(0,b.jsx)("thead",{children:(0,b.jsxs)("tr",{className:"border-b border-gray-100",children:[(0,b.jsx)("th",{className:"text-left text-xs font-medium text-gray-500 pb-2",children:"Nombre"}),(0,b.jsx)("th",{className:"text-left text-xs font-medium text-gray-500 pb-2",children:"Edad"}),(0,b.jsx)("th",{className:"text-left text-xs font-medium text-gray-500 pb-2",children:"Categoría"}),(0,b.jsx)("th",{className:"text-left text-xs font-medium text-gray-500 pb-2",children:"Tutor"}),(0,b.jsx)("th",{className:"text-left text-xs font-medium text-gray-500 pb-2",children:"Estado"})]})}),(0,b.jsx)("tbody",{children:z.map(a=>(0,b.jsxs)("tr",{className:"border-b border-gray-50",children:[(0,b.jsx)("td",{className:"py-2 text-sm font-medium text-gray-900",children:a.nombre}),(0,b.jsx)("td",{className:"py-2 text-sm text-gray-600",children:a.edad||"-"}),(0,b.jsx)("td",{className:"py-2 text-sm text-gray-600",children:a.categoria||"-"}),(0,b.jsx)("td",{className:"py-2 text-sm text-gray-600",children:a.tutor||"-"}),(0,b.jsx)("td",{className:"py-2",children:(0,b.jsx)("span",{className:`text-xs px-2 py-1 rounded-full ${"activo"===a.estado?"bg-emerald-50 text-emerald-600":"bg-gray-100 text-gray-500"}`,children:a.estado})})]},a.id))})]})})]}),(0,b.jsxs)("div",{className:"bg-white rounded-xl border border-gray-100 p-4",children:[(0,b.jsxs)("div",{className:"flex items-center gap-2 mb-4",children:[(0,b.jsx)(r,{className:"h-4 w-4 text-gray-400"}),(0,b.jsx)("h2",{className:"text-sm font-medium text-gray-900",children:"Generar Reportes"})]}),(0,b.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4 mb-4",children:[(0,b.jsxs)("div",{children:[(0,b.jsx)("label",{className:"block text-xs font-medium text-gray-600 mb-1",children:"Fecha Desde"}),(0,b.jsx)("input",{type:"date",value:F,onChange:a=>G(a.target.value),className:"w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"})]}),(0,b.jsxs)("div",{children:[(0,b.jsx)("label",{className:"block text-xs font-medium text-gray-600 mb-1",children:"Fecha Hasta"}),(0,b.jsx)("input",{type:"date",value:H,onChange:a=>I(a.target.value),className:"w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"})]})]}),(0,b.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-3",children:[(0,b.jsxs)("button",{onClick:N,disabled:J,className:"flex items-center justify-center gap-2 px-4 py-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors disabled:opacity-50",children:[(0,b.jsx)(j.AcademicCapIcon,{className:"h-5 w-5"}),(0,b.jsx)("span",{className:"text-sm font-medium",children:"Reporte Cursos"}),(0,b.jsx)(q.ArrowDownTrayIcon,{className:"h-4 w-4"})]}),(0,b.jsxs)("button",{onClick:O,disabled:J,className:"flex items-center justify-center gap-2 px-4 py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition-colors disabled:opacity-50",children:[(0,b.jsx)(l.CurrencyDollarIcon,{className:"h-5 w-5"}),(0,b.jsx)("span",{className:"text-sm font-medium",children:"Reporte Finanzas"}),(0,b.jsx)(q.ArrowDownTrayIcon,{className:"h-4 w-4"})]}),(0,b.jsxs)("button",{onClick:P,disabled:J,className:"flex items-center justify-center gap-2 px-4 py-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition-colors disabled:opacity-50",children:[(0,b.jsx)(i.UserGroupIcon,{className:"h-5 w-5"}),(0,b.jsx)("span",{className:"text-sm font-medium",children:"Reporte Participantes"}),(0,b.jsx)(q.ArrowDownTrayIcon,{className:"h-4 w-4"})]})]}),J&&(0,b.jsxs)("div",{className:"flex items-center justify-center gap-2 mt-4 text-sm text-gray-500",children:[(0,b.jsx)("div",{className:"animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"}),"Generando reporte..."]})]})]})})}if("instructor"===g)return(0,b.jsx)(d.DashboardLayout,{children:(0,b.jsxs)("div",{className:"space-y-4",children:[(0,b.jsx)("div",{className:"flex items-center justify-between",children:(0,b.jsxs)("div",{children:[(0,b.jsx)("h1",{className:"text-lg font-semibold text-gray-900",children:"Dashboard - Instructor"}),(0,b.jsx)("p",{className:"text-xs text-gray-500 capitalize",children:M})]})}),(0,b.jsxs)("div",{className:"grid grid-cols-2 lg:grid-cols-3 gap-3",children:[(0,b.jsx)("div",{className:"bg-white rounded-xl border border-gray-100 p-4",children:(0,b.jsxs)("div",{className:"flex items-center gap-3",children:[(0,b.jsx)("div",{className:"p-2 rounded-lg bg-green-50",children:(0,b.jsx)(m.UsersIcon,{className:"h-5 w-5 text-green-600"})}),(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"text-xs text-gray-500",children:"Mis Grupos"}),(0,b.jsx)("p",{className:"text-xl font-semibold text-gray-900",children:D?"...":B?.grupos.total||0}),(0,b.jsxs)("p",{className:"text-xs text-gray-400",children:[B?.grupos.activos||0," activos"]})]})]})}),(0,b.jsx)("div",{className:"bg-white rounded-xl border border-gray-100 p-4",children:(0,b.jsxs)("div",{className:"flex items-center gap-3",children:[(0,b.jsx)("div",{className:"p-2 rounded-lg bg-emerald-50",children:(0,b.jsx)(i.UserGroupIcon,{className:"h-5 w-5 text-emerald-600"})}),(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"text-xs text-gray-500",children:"Total Estudiantes"}),(0,b.jsx)("p",{className:"text-xl font-semibold text-gray-900",children:D?"...":B?.participantes_total||0}),(0,b.jsx)("p",{className:"text-xs text-gray-400",children:"en todos mis grupos"})]})]})}),(0,b.jsx)("div",{className:"bg-white rounded-xl border border-gray-100 p-4",children:(0,b.jsxs)("div",{className:"flex items-center gap-3",children:[(0,b.jsx)("div",{className:"p-2 rounded-lg bg-amber-50",children:(0,b.jsx)(o.CalendarDaysIcon,{className:"h-5 w-5 text-amber-600"})}),(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"text-xs text-gray-500",children:"Asistencias"}),(0,b.jsx)("p",{className:"text-xl font-semibold text-gray-900",children:"Hoy"}),(0,b.jsx)("p",{className:"text-xs text-gray-400",children:"registrar asistencia"})]})]})})]}),(0,b.jsxs)("div",{className:"bg-white rounded-xl border border-gray-100 p-4",children:[(0,b.jsxs)("div",{className:"flex items-center justify-between mb-4",children:[(0,b.jsxs)("div",{className:"flex items-center gap-2",children:[(0,b.jsx)(j.AcademicCapIcon,{className:"h-4 w-4 text-gray-400"}),(0,b.jsx)("h2",{className:"text-sm font-medium text-gray-900",children:"Mis Grupos Asignados"})]}),(0,b.jsx)(s.default,{href:"/mis-grupos",className:"text-xs text-green-600 hover:text-green-700",children:"Ver todos →"})]}),D?(0,b.jsx)("div",{className:"flex justify-center py-6",children:(0,b.jsx)("div",{className:"animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"})}):B?.grupos.lista&&0!==B.grupos.lista.length?(0,b.jsx)("div",{className:"space-y-2",children:B.grupos.lista.slice(0,5).map(a=>(0,b.jsxs)(s.default,{href:`/mis-grupos/${a.id}`,className:"flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors",children:[(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"text-sm font-medium text-gray-900",children:a.nombre}),(0,b.jsx)("p",{className:"text-xs text-gray-500",children:a.curso})]}),(0,b.jsxs)("div",{className:"text-right",children:[(0,b.jsxs)("p",{className:"text-sm font-medium text-gray-900",children:[a.participantes,"/",a.cupo_maximo]}),(0,b.jsx)("p",{className:"text-xs text-gray-400",children:"estudiantes"})]})]},a.id))}):(0,b.jsx)("p",{className:"text-sm text-gray-500 text-center py-6",children:"No tienes grupos asignados"})]})]})});if("tutor"===g){let a;return(0,b.jsx)(d.DashboardLayout,{children:(0,b.jsxs)("div",{className:"space-y-4",children:[(0,b.jsx)("div",{className:"flex items-center justify-between",children:(0,b.jsxs)("div",{children:[(0,b.jsx)("h1",{className:"text-lg font-semibold text-gray-900",children:"Dashboard - Tutor"}),(0,b.jsx)("p",{className:"text-xs text-gray-500 capitalize",children:M})]})}),(0,b.jsxs)("div",{className:"grid grid-cols-2 lg:grid-cols-4 gap-3",children:[(0,b.jsx)("div",{className:"bg-white rounded-xl border border-gray-100 p-4",children:(0,b.jsxs)("div",{className:"flex items-center gap-3",children:[(0,b.jsx)("div",{className:"p-2 rounded-lg bg-blue-50",children:(0,b.jsx)(i.UserGroupIcon,{className:"h-5 w-5 text-blue-600"})}),(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"text-xs text-gray-500",children:"Mis Participantes"}),(0,b.jsx)("p",{className:"text-xl font-semibold text-gray-900",children:D?"...":B?.participantes.total||0}),(0,b.jsxs)("p",{className:"text-xs text-gray-400",children:[B?.participantes.activos||0," activos"]})]})]})}),(0,b.jsx)("div",{className:"bg-white rounded-xl border border-gray-100 p-4",children:(0,b.jsxs)("div",{className:"flex items-center gap-3",children:[(0,b.jsx)("div",{className:"p-2 rounded-lg bg-emerald-50",children:(0,b.jsx)(k.ClipboardDocumentCheckIcon,{className:"h-5 w-5 text-emerald-600"})}),(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"text-xs text-gray-500",children:"Inscripciones"}),(0,b.jsx)("p",{className:"text-xl font-semibold text-gray-900",children:D?"...":B?.inscripciones.activas||0}),(0,b.jsx)("p",{className:"text-xs text-gray-400",children:"activas"})]})]})}),(0,b.jsx)("div",{className:"bg-white rounded-xl border border-gray-100 p-4",children:(0,b.jsxs)("div",{className:"flex items-center gap-3",children:[(0,b.jsx)("div",{className:"p-2 rounded-lg bg-amber-50",children:(0,b.jsx)(p.DocumentTextIcon,{className:"h-5 w-5 text-amber-600"})}),(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"text-xs text-gray-500",children:"Facturas Pendientes"}),(0,b.jsx)("p",{className:"text-xl font-semibold text-gray-900",children:D?"...":B?.facturas.pendientes||0}),(0,b.jsx)("p",{className:"text-xs text-gray-400",children:"por pagar"})]})]})}),(0,b.jsx)("div",{className:"bg-white rounded-xl border border-gray-100 p-4",children:(0,b.jsxs)("div",{className:"flex items-center gap-3",children:[(0,b.jsx)("div",{className:"p-2 rounded-lg bg-red-50",children:(0,b.jsx)(l.CurrencyDollarIcon,{className:"h-5 w-5 text-red-600"})}),(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"text-xs text-gray-500",children:"Monto Pendiente"}),(0,b.jsx)("p",{className:"text-xl font-semibold text-gray-900",children:D?"...":(a=B?.facturas.monto_pendiente||0,new Intl.NumberFormat("es-EC",{style:"currency",currency:"USD"}).format(a))}),(0,b.jsx)("p",{className:"text-xs text-gray-400",children:"total a pagar"})]})]})})]}),(0,b.jsxs)("div",{className:"grid grid-cols-1 lg:grid-cols-2 gap-4",children:[(0,b.jsxs)("div",{className:"bg-white rounded-xl border border-gray-100 p-4",children:[(0,b.jsxs)("div",{className:"flex items-center justify-between mb-4",children:[(0,b.jsxs)("div",{className:"flex items-center gap-2",children:[(0,b.jsx)(i.UserGroupIcon,{className:"h-4 w-4 text-gray-400"}),(0,b.jsx)("h2",{className:"text-sm font-medium text-gray-900",children:"Mis Participantes"})]}),(0,b.jsx)(s.default,{href:"/mis-participantes",className:"text-xs text-green-600 hover:text-green-700",children:"Ver todos →"})]}),D?(0,b.jsx)("div",{className:"flex justify-center py-6",children:(0,b.jsx)("div",{className:"animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"})}):B?.participantes.lista&&0!==B.participantes.lista.length?(0,b.jsx)("div",{className:"space-y-2",children:B.participantes.lista.slice(0,5).map(a=>(0,b.jsx)("div",{className:"flex items-center justify-between p-3 bg-gray-50 rounded-lg",children:(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"text-sm font-medium text-gray-900",children:a.nombre}),a.edad&&(0,b.jsxs)("p",{className:"text-xs text-gray-500",children:[a.edad," años"]})]})},a.id))}):(0,b.jsxs)("div",{className:"text-center py-6",children:[(0,b.jsx)("p",{className:"text-sm text-gray-500 mb-2",children:"No tienes participantes registrados"}),(0,b.jsx)(s.default,{href:"/mis-participantes",className:"text-sm text-green-600 hover:text-green-700",children:"Agregar participante"})]})]}),(0,b.jsxs)("div",{className:"bg-white rounded-xl border border-gray-100 p-4",children:[(0,b.jsxs)("div",{className:"flex items-center justify-between mb-4",children:[(0,b.jsxs)("div",{className:"flex items-center gap-2",children:[(0,b.jsx)(k.ClipboardDocumentCheckIcon,{className:"h-4 w-4 text-gray-400"}),(0,b.jsx)("h2",{className:"text-sm font-medium text-gray-900",children:"Resumen de Inscripciones"})]}),(0,b.jsx)(s.default,{href:"/mis-inscripciones",className:"text-xs text-green-600 hover:text-green-700",children:"Ver todas →"})]}),(0,b.jsxs)("div",{className:"grid grid-cols-3 gap-4 text-center",children:[(0,b.jsxs)("div",{className:"p-3 bg-emerald-50 rounded-lg",children:[(0,b.jsx)("p",{className:"text-2xl font-bold text-emerald-600",children:B?.inscripciones.activas||0}),(0,b.jsx)("p",{className:"text-xs text-gray-600",children:"Activas"})]}),(0,b.jsxs)("div",{className:"p-3 bg-blue-50 rounded-lg",children:[(0,b.jsx)("p",{className:"text-2xl font-bold text-blue-600",children:B?.inscripciones.completadas||0}),(0,b.jsx)("p",{className:"text-xs text-gray-600",children:"Completadas"})]}),(0,b.jsxs)("div",{className:"p-3 bg-gray-100 rounded-lg",children:[(0,b.jsx)("p",{className:"text-2xl font-bold text-gray-600",children:B?.inscripciones.total||0}),(0,b.jsx)("p",{className:"text-xs text-gray-600",children:"Total"})]})]})]})]})]})})}return(0,b.jsx)(d.DashboardLayout,{children:(0,b.jsxs)("div",{className:"space-y-4",children:[(0,b.jsx)("div",{className:"flex items-center justify-between",children:(0,b.jsxs)("div",{children:[(0,b.jsx)("h1",{className:"text-lg font-semibold text-gray-900",children:"Dashboard"}),(0,b.jsx)("p",{className:"text-xs text-gray-500 capitalize",children:M})]})}),(0,b.jsxs)("div",{className:"bg-white rounded-xl border border-gray-100 p-8 text-center",children:[(0,b.jsx)(j.AcademicCapIcon,{className:"h-12 w-12 text-gray-300 mx-auto mb-4"}),(0,b.jsx)("h2",{className:"text-lg font-medium text-gray-900 mb-2",children:"Bienvenido al Sistema de Cursos Vacacionales"}),(0,b.jsx)("p",{className:"text-sm text-gray-500",children:D?"Cargando...":`Hola, ${a?.nombre||"Usuario"}`})]})]})})}a.s(["default",()=>t],76732)}];

//# sourceMappingURL=80b94_GitHub_proyecto-web2-frontend_src_app_%28dashboard%29_dashboard_page_tsx_77a95db4._.js.map