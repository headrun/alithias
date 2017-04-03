from django.shortcuts import render
from django.http import HttpResponse
import pyodbc
import datetime
#from django.utils import simplejson
import json
import xlwt
from xlwt import Workbook, Style
from xlwt import Workbook, Formula

try:
    import cStringIO as StringIO
except ImportError:
    import StringIO

from django.template.loader import get_template
from django.template import Context
from django.http import HttpResponse
from cgi import escape
from xhtml2pdf import pisa as new_pisa
import os
from xlsxwriter.workbook import Workbook

us_states = { "AL":"Alabama","AK":"Alaska","AZ":"Arizona","AR":"Arkansas","CA":"California","CO":"Colorado","CT":"Connecticut"
 ,"DE":"Delaware","FL":"Florida","GA":"Georgia","HI":"Hawaii","ID":"Idaho","IL":"Illinois","IN":"Indiana"
 ,"IA":"Iowa","KS":"Kansas","KY":"Kentucky","LA":"Louisiana","ME":"Maine","MT":"Montana","NE":"Nebraska"
 ,"NV":"Nevada","NH":"New Hampshire","NJ":"New Jersey","NM":"New Mexico","NY":"New York"
 ,"NC":"North Carolina","ND":"North Dakota","OH":"Ohio","OK":"Oklahoma","OR":"Oregon"
 ,"MD":"Maryland","MA":"Massachusetts","MI":"Michigan","MN":"Minnesota","MS":"Mississippi"
 ,"MO":"Missouri","PA":"Pennsylvania","RI":"Rhode Island","SC":"South Carolina","SD":"South Dakota"
 ,"TN":"Tennessee","TX":"Texas","UT":"Utah","VT":"Vermont","VA":"Virginia"
 ,"WA":"Washington","WV":"West Virginia","WI":"Wisconsin","WY":"Wyoming"}

def index(request):
    return render(request, "alithias/index.html")

def table_pdf(request):
    sample ={}
    sample['trail'] = [{'a':2,'b':4},{'a':5,'b':6}]
    return render_pdf("alithias/table_generate.html",sample)

def render_pdf(template_src, context_dict,file_naming = 'alithias'):
    t = get_template(template_src)
    c = Context(context_dict)
    rendered = t.render(c)
    file_naming = file_naming.replace(' ','_')
    file_name = "%s.html" % file_naming
    pdf_file  = "%s.pdf" % file_naming
    #file_name = "table_generate_new.html"
    #pdf_file = "table_generate_trail.pdf"
    file_ = open(file_name, "w+b")
    file_.write(rendered)
    file_.close()
    phantomjs_path = os.path.join(os.getcwd()+'\\phantomjs\\lib\\phantom\\bin\\phantomjs')
    rasterize_js = os.path.join(os.getcwd()+'\\phantomjs\\lib\\phantom\\examples\\rasterize.js')
    os.system("%s %s %s %s A4" % (phantomjs_path,rasterize_js,file_name, pdf_file))
    with open(pdf_file, 'rb') as pdf:
        response = HttpResponse(pdf.read(), content_type='application/pdf')
        response['Content-Disposition'] = 'filename=%s' % pdf_file
        return response

def render_print(template_src, context_dict):
    t = get_template(template_src)
    c = Context(context_dict)
    rendered = t.render(c)
    html_data  = {}
    html_data ['data'] = str(rendered)
    data = json.dumps(html_data)
    return HttpResponse(data, content_type='application/json')
    #return  HttpResponse(str(rendered))

def fetch_resources(uri, rel):
    cwd = os.getcwd()
    path = cwd+uri
    return path

def dropdown_queries(table_info):
    connection = pyodbc.connect('Driver={SQL Server};Server=localhost;Database=Alithias_Core_V3;UID="";PWD="";Trusted_Connection=yes')
    cursor = connection.cursor()
    tables_data = {}
    for table_name,table_val in table_info.iteritems():
        sql = 'SELECT {0} FROM {1}'.format(table_val,table_name)
        cursor.execute(sql)
        try:
            rows = cursor.fetchall()
        except:
            rows = []
        tables_data['table_'+ table_name] = rows
    strd_data = {}
    final_api_data = {}
    strd_data_list = []
    final_api_list = []

    for table_name, table_data in tables_data.iteritems():
        strd_data_list=[]
        for row in table_data:
            for field in row:
                strd_data_list.append(field)
        final_api_data[table_name] = strd_data_list

    connection.close()
    #final_api_data['data'] = strd_data_list
    final_api_list.append(final_api_data)
    return final_api_list

def admin_dropdown_queries(table_info):
    connection = pyodbc.connect('Driver={SQL Server};Server=localhost;Database=Alithias_Core_V3;UID="";PWD="";Trusted_Connection=yes')
    cursor = connection.cursor()
    tables_data = {}
    for table_name,table_val in table_info.iteritems():
        table_columns = ""
        for t_colu in table_val:
            table_columns =table_columns + t_colu
        if table_columns != "":
            sql = 'SELECT {0} FROM {1}'.format(table_columns,table_name)
            cursor.execute(sql)
            try:
                rows = cursor.fetchall()
            except:
                rows = []
            tables_data[table_name] = rows

    for row_key,row_value in tables_data.iteritems():
        pass

def dropdown_queries_new(table_info):
    connection = pyodbc.connect('Driver={SQL Server};Server=localhost;Database=Alithias_Core_V3;UID="";PWD="";Trusted_Connection=yes')
    cursor = connection.cursor()
    tables_data = {}
    for table_name,table_val in table_info.iteritems():
        if table_name =='Networks':
            sql = 'SELECT {0},{1} FROM {2} where NetworkID>1000'.format(table_val[0], table_val[1], table_name)
        else:
            sql = 'SELECT {0},{1} FROM {2}'.format(table_val[0],table_val[1],table_name)
        if table_name == 'Providers':
            sql = 'select top 1000.ProviderName,ProviderNPI from providers'
        cursor.execute(sql)
        try:
            rows = cursor.fetchall()
        except:
            rows = []
        tables_data['table_'+ table_name] = rows
    strd_data = {}
    final_api_data = {}
    strd_data_list = []
    final_api_list = []

    for table_name, table_data in tables_data.iteritems():
        strd_data_list=[]

        for row in table_data:
            local_values = []
            row_dict = {}
            for field in row:
                local_values.append(field)
            row_dict["id"]=local_values[1]
            row_dict["name"] = local_values[0]
            strd_data_list.append(row_dict)
        final_api_data[table_name] = strd_data_list

    connection.close()
    #final_api_data['data'] = strd_data_list
    final_api_list.append(final_api_data)
    #data = json.dumps(final_api_list)
    #return HttpResponse(data, content_type='application/json')
    return final_api_list

def dropdown_queries_for_selected(table_info):
    connection = pyodbc.connect('Driver={SQL Server};Server=localhost;Database=Alithias_Core_V3;UID="";PWD="";Trusted_Connection=yes')
    cursor = connection.cursor()
    tables_data = {}
    for table_name,table_val in table_info.iteritems():
        if table_name == 'Providers':
            if len(table_val)<5:
                sql = "SELECT {0},{1} FROM {2} where {3}='{4}'".format(table_val[0], table_val[1], table_name,table_val[2],table_val[3])
            elif len(table_val) == 8:
                sql = "SELECT {0},{1} FROM {2} where {3}='{4}' and {5}='{6}' and {7}='{8}'".format(table_val[0], table_val[1], table_name,table_val[2], table_val[3],table_val[4], table_val[5],table_val[6], table_val[7])
            else:
                sql = "SELECT {0},{1} FROM {2} where {3}='{4}' and {5}='{6}'".format(table_val[0], table_val[1], table_name,table_val[2], table_val[3],table_val[4], table_val[5])
            #sql = 'select top 1000.ProviderName,ProviderNPI from providers'
        cursor.execute(sql)
        try:
            rows = cursor.fetchall()
        except:
            rows = []
        tables_data['table_'+ table_name] = rows
    final_api_data = {}
    final_api_list = []

    for table_name, table_data in tables_data.iteritems():
        strd_data_list=[]

        for row in table_data:
            local_values = []
            row_dict = {}
            for field in row:
                local_values.append(field)
            row_dict["id"]=local_values[1]
            row_dict["name"] = local_values[0]
            strd_data_list.append(row_dict)
        final_api_data[table_name] = strd_data_list

    connection.close()
    final_api_list.append(final_api_data)
    return final_api_list

def get_pdf_parameters(data):
    connection = pyodbc.connect('Driver={SQL Server};Server=localhost;Database=Alithias_Core_V3;UID="";PWD="";Trusted_Connection=yes')
    cursor = connection.cursor()
    query = 'select %s from %s where %s=%s' % tuple(data)
    cursor.execute(query)
    rows = cursor.fetchall()
    connection.close()
    if len(rows) > 0:
        return rows[0][0]
    else:
        return ''

def procedure_pricing_dropdowns_old(request):
    dropdown_info = {}
    dropdown_info['Procedures']="ProcedureName"
    dropdown_info['NetworksAdminTool'] = "NetworkName"

    us_states = ["WI","Boston"]
    dd_data = dropdown_queries(dropdown_info)
    dd_data[0]['states'] = us_states
    dd_data[0]['table_Networks'] = dd_data[0]['table_NetworksAdminTool']
    data = json.dumps(dd_data)
    return HttpResponse(data, content_type='application/json')

def procedure_pricing_dropdowns(request):
    dropdown_info = {}
    dropdown_info['Procedures']=["ProcedureName","ProcedureID"]
    dropdown_info['NetworksAdminTool'] = ["NetworkName","NetworkID"]
    #us_states = {"WI":"Wisconsin","Ut":"Utah"}
    dd_data = dropdown_queries_new(dropdown_info)
    #dd_data[0]['states'] = us_states
    dd_data[0]['table_Networks'] = dd_data[0]['table_NetworksAdminTool']
    data = json.dumps(dd_data)
    return HttpResponse(data, content_type='application/json')

def proc_pricing_breakdown_dropdowns(request):
    dropdown_info = {}
    dropdown_info['Procedures'] = "ProcedureID"
    dropdown_info['Networks'] = "NetworkID"
    dd_data = dropdown_queries(dropdown_info)
    data = json.dumps(dd_data)
    return HttpResponse(data, content_type='application/json')

def proc_pricing_episode_dropdowns(request):
    dropdown_info = {}
    dropdown_info['NetworksAdminTool'] = ["NetworkName","NetworkID"]
    dropdown_info['Procedures'] = ["ProcedureName", "ProcedureID"]
    dropdown_info['Providers'] = ["ProviderName", "ProviderNPI"]

    dd_data = dropdown_queries_new(dropdown_info)
    us_state_list = []
    for state_code, state_name in us_states.iteritems():
        us_state_dropdown = {}
        us_state_dropdown['id'] = state_code
        us_state_dropdown['name'] = state_name
        us_state_list.append(us_state_dropdown)
    dd_data[0]['states'] = us_state_list
    dd_data[0]['table_Networks'] = dd_data[0]['table_NetworksAdminTool']
    data = json.dumps(dd_data)
    return HttpResponse(data, content_type='application/json')

def proc_episode_get_city(request):
    try:
        provider_state = request.GET['state']
    except:
        provider_state = ''
    dropdown_info = {}
    dropdown_info['Providers'] = ["PracticeAddressCity","ProviderNPI",'PracticeAddressState',provider_state]
    dd_data = dropdown_queries_for_selected(dropdown_info)
    cities_list = []
    city_names= []
    for city in dd_data[0]['table_Providers']:
        if city['name'] not in city_names:
            cities_list.append(city)
            city_names.append(city['name'])
    dd_data[0]['cities'] = cities_list
    del dd_data[0]['table_Providers']
    data = json.dumps(dd_data)
    return HttpResponse(data, content_type='application/json')

def proce_episode_get_provider(request):
    try:
        provider_state = request.GET['state']
    except:
        provider_state = ''
    try:
        city = request.GET['PracticeAddressCity']
    except:
        city = ''
    dropdown_info = {}
    dropdown_info['Providers'] = ["ProviderName","ProviderNPI",'PracticeAddressState',provider_state,'PracticeAddressCity',city]
    dd_data = dropdown_queries_for_selected(dropdown_info)
    dd_data[0]['provider_name'] = dd_data[0]['table_Providers']
    del dd_data[0]['table_Providers']
    data = json.dumps(dd_data)
    return HttpResponse(data, content_type='application/json')


def proc_episode_city(request):
    try:
        provider_name = request.GET['ProviderName']
    except:
        provider_name = ''
    dropdown_info = {}
    dropdown_info['Providers'] = ["PracticeAddressCity","ProviderNPI",'ProviderName',provider_name]
    dd_data = dropdown_queries_for_selected(dropdown_info)
    data = json.dumps(dd_data)
    return HttpResponse(data, content_type='application/json')

def proc_episode_npi(request):
    try:
        provider_name = request.GET['ProviderName']
    except:
        provider_name = ''
    try:
        city = request.GET['PracticeAddressCity']
    except:
        city = ''
    try:
        provider_state = request.GET['state']
    except:
        provider_state = ''
    dropdown_info = {}
    dropdown_info['Providers'] = ["ProviderNPI","ProviderNPI",'ProviderName',provider_name,'PracticeAddressCity',city,'PracticeAddressState',provider_state]
    dd_data = dropdown_queries_for_selected(dropdown_info)
    dd_data[0]['provider_npi'] = dd_data[0]['table_Providers']
    del dd_data[0]['table_Providers']
    data = json.dumps(dd_data)
    return HttpResponse(data, content_type='application/json')


def cmp_network_by_state_dropdowns(request):
    dropdown_info = {}
    dropdown_info['Companies'] = ["CompanyName", "CompanyID"]
    dd_data = dropdown_queries_new(dropdown_info)
    data = json.dumps(dd_data)
    return HttpResponse(data, content_type='application/json')


def proc_code_summary_proc_dropdowns(request):
    dropdown_info = {}
    dropdown_info['Procedures'] = ["ProcedureName", "ProcedureID"]
    dd_data = dropdown_queries_new(dropdown_info)
    data = json.dumps(dd_data)
    return HttpResponse(data, content_type='application/json')

def cost_cmpr_summary_dropdowns(request):
    dropdown_info = {}
    dropdown_info['Companies'] = ["CompanyName","CompanyID"]
    dd_data = dropdown_queries_new(dropdown_info)
    data = json.dumps(dd_data)
    return HttpResponse(data, content_type='application/json')

def Procedur_Maintenance_dropdowns(request):
    dropdown_info = {}
    pass

def stored_procedure_calling (st_procedure_name,params):
    connection = pyodbc.connect('Driver={SQL Server};Server=localhost;Database=Alithias_Core_V3;UID="";PWD="";Trusted_Connection=yes')
    #connection = pyodbc.connect('Driver={SQL Server};Server=localhost;Database=Alithias_Core_V3;')
    cursor = connection.cursor()
    #SET NOCOUNT ON;
    noCount = """ SET NOCOUNT ON; """
    #noCount = ''
    stored_procedure_parameters  =[st_procedure_name]
    stored_procedure_parameters = stored_procedure_parameters +params
    st_query  = "exec"
    for i in range(len(stored_procedure_parameters)) :
        if i+1 ==1:
            st_query = st_query + " %s"
        elif i+1==len(stored_procedure_parameters):
            st_query = st_query + " '%s'"
        else:
            st_query = st_query + " '%s',"

    """for i in range(len(stored_procedure_parameters)):
        if i + 1 == 1:
            st_query = st_query + " %s"
        elif i + 1 == len(stored_procedure_parameters):
            st_query = st_query + " %s"
        else:
            st_query = st_query + " %s," """


    #sql = "exec rptProcedurePricing '%s', '%s', '%s', '%s', '%s', '%s', '%s'" % params
    #sql = "exec rptProcedurePricing %s, %s, %s, %s, %s, %s, %s" % params
    sql = st_query % tuple(stored_procedure_parameters)

    if "Provider_SelectAll" in sql:
        sql = "select top 1000.* from providers where PracticeAddressState = 'WI'"
    cursor.execute(noCount+sql)
    if ('Update' in sql) or ('Delete' in sql) or ('Insert' in sql):
        cursor.commit()
    #cursor.commit()
    #cursor.execute(sql)
    try:
        tables = cursor.fetchall()
    except:
        tables = []
    strd_data = {}
    final_api_data = {}
    strd_data_list = []
    final_api_list = []
    count = 1


    for row in tables:
        local_count = 1
        key = 'row_' + str(count)
        strd_data[key] = [row]
        #final_api_data[key] = {}
        count = count + 1
        strd_data_list.append(row)
        final_api_dict = {}
        # print row.column_name
        for field in row:
            tb_col = 'col_' + str(local_count)
            if field != None:
                field = str(field)
            final_api_dict[tb_col] = field
            local_count = local_count+1
        final_api_list.append(final_api_dict)
    connection.close()
    final_api_data['data']= final_api_list
    table_format = {}
    table_format['data'] = final_api_data
    data = json.dumps(final_api_list)

    #return final_api_list
    return HttpResponse(data, content_type='application/json')
    #return final_api_data

def stored_procedure_calling_list (st_procedure_name,params):
    connection = pyodbc.connect('Driver={SQL Server};Server=localhost;Database=Alithias_Core_V3;UID="";PWD="";Trusted_Connection=yes')
    cursor = connection.cursor()
    #SET NOCOUNT ON;
    noCount = """ SET NOCOUNT ON; """
    #noCount = ''
    stored_procedure_parameters  =[st_procedure_name]
    stored_procedure_parameters = stored_procedure_parameters +params
    st_query  = "exec"
    for i in range(len(stored_procedure_parameters)) :
        if i+1 ==1:
            st_query = st_query + " %s"
        elif i+1==len(stored_procedure_parameters):
            st_query = st_query + " '%s'"
        else:
            st_query = st_query + " '%s',"

    sql = st_query % tuple(stored_procedure_parameters)
    cursor.execute(noCount+sql)
    try:
        tables = cursor.fetchall()
    except:
        tables = []
    strd_data = {}
    final_api_data = {}
    strd_data_list = []
    final_api_list = []
    count = 1

    for row in tables:
        local_count = 1
        key = 'row_' + str(count)
        strd_data[key] = [row]
        #final_api_data[key] = {}
        count = count + 1
        strd_data_list.append(row)
        final_api_dict = {}
        # print row.column_name
        for field in row:
            tb_col = 'col_' + str(local_count)
            if field != None:
                field = str(field)
                final_api_dict[tb_col] = field.strip()
            else:
                final_api_dict[tb_col] = field
            local_count = local_count+1

        final_api_list.append(final_api_dict)
    connection.close()
    final_api_data['data']= final_api_list
    table_format = {}
    table_format['data'] = final_api_data
    #data = json.dumps(final_api_list)

    return final_api_list
    #return HttpResponse(data, content_type='application/json')
    #return final_api_data

def stored_procedure_calling_new (st_procedure_name,params):
    #cursor = connection.cursor()
    #SET NOCOUNT ON;
    stored_procedure_parameters  =[st_procedure_name]
    stored_procedure_parameters = stored_procedure_parameters +params
    st_query  = "exec"

    for i in range(len(stored_procedure_parameters)) :
        if i+1 ==1:
            st_query = st_query + " %s"
        elif i+1==len(stored_procedure_parameters):
            st_query = st_query + " '%s'"
        else:
            st_query = st_query + " '%s',"


    #sql = "exec rptProcedurePricing '%s', '%s', '%s', '%s', '%s', '%s', '%s'" % params
    #sql = "exec rptProcedurePricing %s, %s, %s, %s, %s, %s, %s" % params
    sql = st_query % tuple(stored_procedure_parameters)

    connection_string = 'Driver={SQL Server};Server=localhost;Database=Alithias_Core_V3;Trusted_Connection=yes'
    with pyodbc.connect(connection_string) as connection:
        connection.execute(sql)
        result = connection.execute(sql)
        data = result.fetchall()
    #import pdb;pdb.set_trace()
    #cursor.execute(sql)
    #tables = cursor.fetchall()
    strd_data = {}
    strd_data_list = []
    count = 1

    for row in data:
        key = 'row_' + str(count)
        strd_data[key] = [row]
        count = count + 1
        strd_data_list.append(row)
        # print row.column_name
        for field in row:
            pass

    #connection.close()
    return strd_data_list

def procedure_pricing(request):
    file_type = request.GET.get('file_type', '')
    try :
        procedure_id = request.GET['ProcedureID']
    except:
        procedure_id = 1805
    try :
        network_id = request.GET['NetworkID']
    except:
        network_id = 2019
    try:
        procedure_code_filter = request.GET['ProcedureCodeFilter']
    except:
        procedure_code_filter = ''
    enforce_req = request.GET['EnforceRequirements']
    if enforce_req == 'true':
        enforce_req = 1
    else:
        enforce_req = 0
    try:
        in_network = request.GET['InNetworkOnly']
    except:
        in_network = 'false'
    try:
        state = request.GET['state']
    except:
        state = 'WI'
    try:
        user_id = request.GET['UserID']
    except:
        user_id = 184
    params = [procedure_id,network_id, procedure_code_filter, enforce_req, in_network, state, user_id]
    strd_data_list = stored_procedure_calling_list('rptProcedurePricing', params)
    column_names = ['col_6','col_7','col_8','col_9','col_10','col_12','col_13','col_14','col_15','col_16',
                    'col_17','col_18','col_19','col_20','col_11','col_24','col_25','col_26']
    new_data_list = adding_dollar(strd_data_list, column_names)
    final_data_list = []
    for pr_dict in new_data_list['dollar_col']:
        pr_dict['col_30'] = 'Breakdown'
        pr_dict['col_31'] = 'Episode'
        final_data_list.append(pr_dict)
    data = json.dumps(final_data_list)

    selected_param  = {}
    selected_param['State'] = request.GET.get('stateName', '')
    selected_param['Network'] = request.GET.get('networdName', '')
    selected_param['Procedure'] = request.GET.get('procName', '')
    if file_type == 'excel':
        header = ['NPI', 'Facility', 'City', 'FacilityType', 'MinTotal', 'LikelyTotal', 'MaxTotal', 'MinFacility',
                  'LikelyFacility', 'MaxFacility', 'MinPhysician', 'LikelyPhysician', 'MaxPhysician', 'MinAnesthesia',
                  'LikelyAnesthesia', 'MaxAnesthesia', 'MinRadiology',
                  'LikelyRadiology', 'MaxRadiology', 'MinLab', 'LikelyLab', 'MaxLab']

        column_mapping_dict = {'NPI': 'col_5', 'Facility': 'col_1', 'City': 'col_2', 'FacilityType': 'col_4',
                               'MinTotal': 'col_24', 'LikelyTotal': 'col_25', 'MaxTotal': 'col_26','MinFacility': 'col_6',
                               'LikelyFacility': 'col_7', 'MaxFacility': 'col_8', 'MinPhysician': 'col_9',
                               'LikelyPhysician': 'col_10', 'MaxPhysician': 'col_11','MinAnesthesia': 'col_12', 'LikelyAnesthesia': 'col_13',
                               'MaxAnesthesia': 'col_14','MinRadiology': 'col_15','LikelyRadiology': 'col_16', 'MaxRadiology': 'col_17',
                               'MinLab': 'col_18','LikelyLab': 'col_19', 'MaxLab': 'col_20'}
        procedure_name = 'Procedure Pricing'
        excel_download = common_excel_generation(header, column_mapping_dict, procedure_name, final_data_list,selected_param)
        return excel_download
    elif file_type == 'pdf':
        procedure_name = 'Procedure Pricing'
        excel_download = render_pdf('alithias/procedure_pricing.html', {'json_data': final_data_list, 'selected_param':selected_param},procedure_name)
        return excel_download

    return HttpResponse(data, content_type='application/json')

def procedure_pricing_breakdown_old(request):
    """@ProcedureID,@NetworkID,@FacilityNPI,@ProcedureCodeFilter"""
    try :
        procedure_id = request.GET['ProcedureID']
    except:
        procedure_id = 1805
    try :
        network_id = request.GET['NetworkID']
    except:
        network_id = 2019
    try:
        facility_npi = request.GET['FacilityNPI']
    except:
        facility_npi = 1013995521
    try:
        procedure_code_filter = request.GET['ProcedureCodeFilter']
    except:
        procedure_code_filter = ''
    params = [procedure_id,network_id,facility_npi,procedure_code_filter]
    strd_data_list = stored_procedure_calling_list('rptProcedurePricingDetail', params)
    column_names = ['col_7']
    new_data_list = adding_dollar(strd_data_list, column_names)
    data = json.dumps(new_data_list['dollar_col'])
    return HttpResponse(data, content_type='application/json')

def procedure_pricing_breakdown(request):
    """@ProcedureID,@NetworkID,@FacilityNPI,@ProcedureCodeFilter"""
    file_type = request.GET.get('file_type', '')
    try :
        procedure_id = request.GET['ProcedureID']
    except:
        procedure_id = 1805
    try :
        network_id = request.GET['NetworkID']
    except:
        network_id = 2019
    try:
        facility_npi = request.GET['FacilityNPI']
    except:
        facility_npi = 1013995521
    try:
        procedure_code_filter = request.GET['ProcedureCodeFilter']
    except:
        procedure_code_filter = ''
    params = [procedure_id,network_id,facility_npi,procedure_code_filter]
    strd_data_list = stored_procedure_calling_list('rptProcedurePricingDetail', params)
    facility_name = {}
    for dict in strd_data_list:
        epi_cost = float('%.2f' % round(float(dict['col_7']), 0))
        epi_cost = format(epi_cost, '0,.0f')
        dict['col_7'] = str(epi_cost)
        if facility_name.has_key(dict['col_5']):
            facility_name[dict['col_5']].append(dict)
        else:
            facility_name[dict['col_5']] = [dict]

    final_fac_list = []
    for fac_key,fac_values in facility_name.iteritems():
        fac_dict = {}
        fac_dict['category_name'] = fac_key
        fac_dict['category_data'] = fac_values

        final_fac_list.append(fac_dict)
    selected_param = {}
    procedure_name = request.GET.get('procName', '')
    if not procedure_name :
        procedure_name = get_pdf_parameters(['ProcedureName','Procedures','ProcedureID',procedure_id])
    selected_param['Procedure'] = procedure_name
    network_name = request.GET.get('networkName', '')
    if not network_name :
        network_name = get_pdf_parameters(['NetworkName','NetworksAdminTool','NetworkID',network_id])
    selected_param['Network'] = network_name
    selected_param['FacilityNPI'] = request.GET.get('FacilityNPI', '')
    #selected_param['ProcedureCodeFilter'] = request.GET.get('ProcedureCodeFilter', '')

    if file_type == 'excel':
        header = ['NPI','Provider','city','ProviderType','EpisodeCost']
        column_mapping_dict = {'NPI':'col_6','Provider':'col_1','city':'col_2','ProviderType':'col_3','EpisodeCost':'col_7'}
        procedure_name = 'Procedure Pricing Details'
        excel_download = common_excel_generation(header, column_mapping_dict, procedure_name, final_fac_list,selected_param)
        return excel_download
    elif file_type=='pdf':
        procedure_name = 'Procedure Pricing Details'
        excel_download = render_pdf('alithias/procedure_pricing_details.html', {'json_data': final_fac_list, 'selected_param':selected_param},procedure_name)
        return excel_download
    elif file_type == 'print' :
        procedure_name = 'Procedure Pricing Details'
        excel_download = render_print('alithias/procedure_pricing_details.html', {'json_data': final_fac_list})
        return excel_download
    data = json.dumps(final_fac_list)
    return HttpResponse(data, content_type='application/json')


def procedure_pricing_breakdown_cpt(request):
    """@ProviderNPI"""
    try :
        provider_id = request.GET['ProviderID']
    except:
        provider_id = 1073626917

    params = [provider_id]
    strd_data_list = stored_procedure_calling('rptProviderDetail', params)
    return HttpResponse(strd_data_list)

def procedure_pricing_breakdown_cpt(request):
    """@ProviderNPI"""
    try :
        provider_id = request.GET['ProviderID']
    except:
        provider_id = 1073626917

    params = [provider_id]
    strd_data_list = stored_procedure_calling('rptProviderDetail', params)
    return HttpResponse(strd_data_list)

def provider_pricing_breakdown_cpt(request):
    """@ProviderNPI"""
    file_type = request.GET.get('file_type', '')
    try :
        procedure_id = request.GET['ProcedureID']
    except:
        procedure_id = ''
    try :
        network_id = request.GET['NetworkID']
    except:
        network_id = ''
    try:
        provider_npi = request.GET['ProviderNPI']
    except:
        provider_npi = ''
    try:
        cast_cat_code = request.GET['CostCategoryCode']
    except:
        cast_cat_code = 'PHYSICIAN'
    try:
        facility_prov_npi = request.GET['FacilityProviderNPI']
    except:
        facility_prov_npi = 1518993880
    params = [procedure_id,network_id,facility_prov_npi,provider_npi,cast_cat_code]
    strd_data_list = stored_procedure_calling_list('rptProviderPricingDetail', params)
    factor_claim_data = {}
    column_names = ['col_24','col_18','col_12']
    final_factor_cost = []
    new_data_list = adding_dollar(strd_data_list,column_names)
    round_value =0
    for n_dict in new_data_list['dollar_col']:
        round_value = float('%.2f' % round(float(new_data_list['cost_count']), 0))
        price_date = n_dict['col_13'].split(' ')
        if len(price_date) > 0:
            n_dict['col_13'] = price_date[0]
        try:
            discount_perc = 100*float(n_dict['col_17'])
            n_dict['col_17'] = str(format(discount_perc, '0,.0f')) + '%'
        except:
            pass
        n_dict['total'] = '$'+str(round_value)
        final_factor_cost.append(n_dict)

    factor_claim_data['data'] = final_factor_cost
    round_value = format(round_value, '0,.0f')
    factor_claim_data['factor_total'] = '$'+str(round_value)
    selected_param = {}
    selected_param['ProviderNPI'] = request.GET.get('ProviderNPI', '')
    procedure_name = request.GET.get('procName', '')
    if not procedure_name:
        procedure_name = get_pdf_parameters(['ProcedureName', 'Procedures', 'ProcedureID', procedure_id])
    selected_param['Procedure'] = procedure_name
    network_name = request.GET.get('networkName', '')
    if not network_name:
        network_name = get_pdf_parameters(['NetworkName', 'NetworksAdminTool', 'NetworkID', network_id])
    selected_param['Network'] = network_name
    selected_param['Facility Provider NPI'] = request.GET.get('FacilityProviderNPI', '')
    selected_param['Cost Category Code'] = request.GET.get('CostCategoryCode', '')

    if file_type == 'excel':
        header = ['Code','Code Description','EpisodeCount','RetailPrice',
                  'PriceDate','PriceSource','DiscountPercentage','DiscountedAmount',
                  'DiscountSource','CodeCostFactor','FactoredCost']
        column_mapping_dict = {'Code':'col_9','Code Description':'col_11','EpisodeCount':'col_7',
                               'RetailPrice':'col_12','PriceDate':'col_13','PriceSource':'col_15','DiscountPercentage':'col_17',
                               'DiscountedAmount':'col_18','DiscountSource':'col_20','CodeCostFactor':'col_22','FactoredCost':'col_24'}
        procedure_name = 'Provider Pricing details'
        excel_download = common_excel_generation(header, column_mapping_dict, procedure_name, factor_claim_data,selected_param)
        return excel_download
    elif file_type == 'pdf':
        procedure_name = 'Provider Pricing details'
        excel_download = render_pdf('alithias/provider_pricing_details.html', {'json_data':factor_claim_data, 'selected_param':selected_param}, procedure_name)
        return excel_download
    data = json.dumps(factor_claim_data)
    return HttpResponse(data, content_type='application/json')

def adding_dollar (strd_data_list,column_names):
    cost_count = 0
    new_data_list = []
    for data_dict in strd_data_list:
        if data_dict.has_key('col_24'):
            cost_count = cost_count + float(data_dict['col_24'])
        local_dict = {}
        for dt_key, dt_value in data_dict.iteritems():
            if dt_key in column_names:
                #import pdb;pdb.set_trace()
                if dt_value == None:
                    accuracy_agg = 0.00
                    accuracy_agg = float('%.2f' % round(float(accuracy_agg), 0))
                    accuracy_agg = format(accuracy_agg, '0,.0f')
                else:
                    accuracy_agg = float('%.2f' % round(float(dt_value), 0))
                    accuracy_agg = format(accuracy_agg, '0,.0f')
                local_dict[dt_key] = '$' + str(accuracy_agg)
            else:
                local_dict[dt_key] = dt_value
        new_data_list.append(local_dict)
    result = {}
    result ['dollar_col'] = new_data_list
    result ['cost_count'] = cost_count
    return result

def procedure_pricing_episode(request):
    """@StartDate,@EndDate ,@ProcedureID,@NetworkID,@CompanyID,@FacilityNPI,@PatientID,@FirstDateOfService,@ProcedureCode"""
    file_type = request.GET.get('file_type', '')
    start_date,end_date,company_id,patient_id,first_data_service,procedure_code = '','','','','',''
    try :
        procedure_id = request.GET['ProcedureID']
    except:
        procedure_id = 1805
    try :
        network_id = request.GET['NetworkID']
    except:
        network_id = 2019
    try:
        facility_npi = request.GET['FacilityNPI']
    except:
        facility_npi = 1861447179
    params = [start_date,end_date,procedure_id,network_id,company_id,facility_npi,patient_id,first_data_service,procedure_code]
    strd_data_list = stored_procedure_calling_list('rptEpisodeDetails', params)
    epi_name = {}
    final_epi_details = []
    for epi_dict in strd_data_list:
        epi_code = epi_dict['col_6']
        if epi_name.has_key(epi_code):
            if epi_name[epi_code].has_key(epi_dict['col_19']):
                epi_name[epi_code][epi_dict['col_19']].append(epi_dict)
            else:
                epi_name[epi_code][epi_dict['col_19']] = [epi_dict]
        else:
            epi_name[epi_code] = {}
            epi_name[epi_code][epi_dict['col_19']] = [epi_dict]

        final_epi_details = []
        for ep_cc_key, ep_cc_value in epi_name.iteritems():
            ep_cc_dict = {}
            ep_cc_rtl_total = 0
            ep_cc_allowed_total = 0
            ep_cc_code = 'trail'
            ep_cc_list = []
            for cc_key, cc_values in ep_cc_value.iteritems():
                cc_dict = {}
                cc_retail_total = 0
                cc_allowed_total = 0
                for csct_dict in cc_values:
                    if ',' in str(csct_dict['col_7']):
                        csct_dict['col_7'] = str(csct_dict['col_7']).replace(',','')
                    rt_amt = float('%.2f' % round(float(csct_dict['col_7']), 0))
                    csct_dict['col_7'] = str(rt_amt)
                    if ',' not in str(rt_amt):
                        csct_dict['col_7'] = str(format(rt_amt, '0,.0f'))
                    if ',' in str(csct_dict['col_8']):
                        csct_dict['col_8'] = str(csct_dict['col_8']).replace(',','')
                    allowd_amt = float('%.2f' % round(float(csct_dict['col_8']), 0))
                    csct_dict['col_8'] = str(allowd_amt)
                    if ',' not in str(allowd_amt):
                        csct_dict['col_8'] = str(format(allowd_amt, '0,.0f'))
                    cc_retail_total = cc_retail_total + rt_amt
                    cc_allowed_total = cc_allowed_total + allowd_amt
                    epi_key = str(csct_dict['col_6']) + str(csct_dict['col_10'])
                cc_dict['csct_type'] = cc_key
                cc_dict['csct_data'] = cc_values
                cc_dict['csct_retail_total'] = str(format(cc_retail_total, '0,.0f'))
                ep_cc_rtl_total = ep_cc_rtl_total + cc_retail_total
                cc_dict['csct_allowed_total'] = str(format(cc_allowed_total, '0,.0f'))
                ep_cc_allowed_total = ep_cc_allowed_total + cc_allowed_total
                ep_cc_list.append(cc_dict)
            ep_cc_dict['epi_key'] = epi_key
            ep_cc_dict['epi_data'] = ep_cc_list
            ep_cc_dict['epi_retail_total'] = str(format(ep_cc_rtl_total, '0,.0f'))
            ep_cc_dict['epi_allowed_total'] = str(format(ep_cc_allowed_total, '0,.0f'))
            final_epi_details.append(ep_cc_dict)

    final_epi_details = sorted(final_epi_details, key=lambda k: k['epi_key'],reverse=True)
    data = json.dumps(final_epi_details)
    selected_param = {}
    #selected_param['Provider Name'] = request.GET.get('providerName', '')
    procedure_name = request.GET.get('procName', '')
    if not procedure_name:
        procedure_name = get_pdf_parameters(['ProcedureName', 'Procedures', 'ProcedureID', procedure_id])
    selected_param['Procedure'] = procedure_name
    network_name = request.GET.get('networkName', '')
    if not network_name:
        network_name = get_pdf_parameters(['NetworkName', 'NetworksAdminTool', 'NetworkID', network_id])
    selected_param['Network'] = network_name
    selected_param['Facility NPI'] = request.GET.get('FacilityNPI', '')

    if file_type == 'excel':
        header = ['NPI','Provider','ProviderType','Network','ProcdureCode','Modifier1','Modifier2',
                  'RevenueCode','Mapping','Units','RetailAmount','AllowedAmount']
        column_mapping_dict = {'NPI':'col_12','Provider':'col_1','ProviderType':'col_2','Network':'col_4','ProcdureCode':'col_13',
                               'Modifier1':'col_15','Modifier2':'col_16','RevenueCode':'col_14','Mapping':'col_20',
                               'Units':'col_9','RetailAmount':'col_7','AllowedAmount':'col_8'}
        #procedure_name = 'Procedure Provider Episode Details'
        procedure_name = 'Episode Details'
        excel_download = common_excel_generation(header, column_mapping_dict, procedure_name, final_epi_details,selected_param)
        return excel_download
    elif file_type == 'pdf':
        #procedure_name = 'Procedure Provider Episode Details'
        procedure_name = 'Episode Details'
        excel_download = render_pdf('alithias/episode_details.html', {'json_data': final_epi_details, 'selected_param':selected_param}, procedure_name)
        return excel_download
    return HttpResponse(data, content_type='application/json')
    #for costcat_key,costcat_values in epi_name.iteritems():
    #return HttpResponse(strd_data_list)

def company_network_by_state(request):
    """CompanyID,State"""
    try:
        company_id = request.GET['CompanyID']
    except:
        company_id =301
    state = ''
    params = [company_id,state]

    #strd_data_list = stored_procedure_calling('rptCompanyNetworksByState', params)
    strd_data_list = stored_procedure_calling_list('rptCompanyNetworksByState', params)
    state_name = {}
    for dict in strd_data_list:
        if state_name.has_key(dict['col_5']):
            state_name[dict['col_5']].append(dict)
        else:
            state_name[dict['col_5']] = [dict]
    final_claim_data = {}
    for st_name,st_values in state_name.iteritems() :
        claim_count = 0
        for st_value in st_values:
            claim_count = claim_count+int(st_value['col_6'])
        final_claim_data[st_name] = st_values
        final_claim_data[st_name+'_total'] = claim_count

    """import pdb;
    pdb.set_trace()"""
    data = json.dumps(final_claim_data)

    #return final_api_list
    return HttpResponse(data, content_type='application/json')
    # return final_api_data
    #return HttpResponse(strd_data_list)

def company_network_by_state_new(request):
    file_type = request.GET.get('file_type', '')
    """CompanyID,State"""
    try:
        company_id = request.GET['CompanyID']
    except:
        company_id =301
    state = ''
    params = [company_id,state]

    #strd_data_list = stored_procedure_calling('rptCompanyNetworksByState', params)
    strd_data_list = stored_procedure_calling_list('rptCompanyNetworksByState', params)
    state_name = {}
    for dict in strd_data_list:
        if state_name.has_key(dict['col_5']):
            state_name[dict['col_5']].append(dict)
        else:
            state_name[dict['col_5']] = [dict]
    final_claim_data = {}
    final_claim_list = []
    for st_name,st_values in state_name.iteritems() :
        claim_count = 0
        state_dict = {}
        for st_value in st_values:
            claim_count = claim_count+int(st_value['col_6'])
            st_value['col_6'] = int(st_value['col_6'])
        final_claim_data[st_name] = st_values
        final_claim_data[st_name+'_total'] = claim_count
        if us_states.has_key(st_name):
            state_dict['state_name'] = us_states[st_name]
        else:
            state_dict['state_name'] = st_name
        #state_dict['state_data'] = st_values
        state_dict['state_data'] = sorted(st_values, key=lambda k: k['col_6'],reverse=True)
        state_dict['state_total'] = format(claim_count, '0,.0f')
        final_claim_list.append(state_dict)
    final_claim_list = sorted(final_claim_list, key=lambda k: k['state_name'])
    selected_param = {}
    selected_param['Comapny'] = request.GET.get('companyName', '')
    if file_type == 'excel':
        header = ['Network','ClaimCount']
        column_mapping_dict = {'Network':'col_4','ClaimCount':'col_6'}
        procedure_name = 'Comany Network By State'
        excel_download = common_excel_generation(header, column_mapping_dict, procedure_name, final_claim_list,selected_param)
        return excel_download
    if file_type == 'pdf':
        procedure_name = 'Comany Network By State'
        excel_download = render_pdf('alithias/company_network_by_state.html',{'json_data':final_claim_list , 'selected_param':selected_param},procedure_name)
        return excel_download
    data = json.dumps(final_claim_list)
    return HttpResponse(data, content_type='application/json')


def pr_code_summary(request):
    file_type = request.GET.get('file_type', '')
    try :
        procedure_id = request.GET['ProcedureID']
    except:
        procedure_id = 2604
    try:
        pr_type_code = request.GET['ProviderTypeCode']
    except:
        pr_type_code = ''
    state = ''
    params = [procedure_id,0,pr_type_code]
    strd_data_list = stored_procedure_calling_list('rptProcedureCodeSummaryForProcedure', params)
    final_data_list = []
    for pr_dict in strd_data_list:
        avg_amt = float('%.2f' % round(float(pr_dict['col_10']), 0))
        min_amt = float('%.2f' % round(float(pr_dict['col_8']), 0))
        max_amt = float('%.2f' % round(float(pr_dict['col_9']), 0))
        pr_dict['col_8'] = '$' + str(format(min_amt, '0,.0f'))
        pr_dict['col_9'] = '$' + str(format(max_amt, '0,.0f'))
        pr_dict['col_10'] = '$' + str(format(avg_amt, '0,.0f'))
        per_col = float(pr_dict['col_6']) * 100
        per_col = float('%.2f' % round(per_col, 0))
        pr_dict['col_6'] = str(format(per_col, '0,.0f'))+'%'
        final_data_list.append(pr_dict)
    data = json.dumps(final_data_list)
    selected_param = {}
    selected_param['Procedure'] = request.GET.get('procName', '')
    if file_type== 'excel':
        header = ['Code', 'ProcedureName', 'Claims', 'Episodes', '%OfEpisodes', 'MinAmount', 'MaxAmount', 'AvgAmount','Mapping']
        column_mapping_dict = {'Code':'col_3', 'ProcedureName':'col_4', 'Claims':'col_7', 'Episodes':'col_5', '%OfEpisodes':'col_6',
                                'MinAmount':'col_8', 'MaxAmount':'col_9', 'AvgAmount':'col_10', 'Mapping':'col_12'}
        procedure_name = 'Procedure Code Summary'
        excel_download = common_excel_generation(header,column_mapping_dict,procedure_name,final_data_list,selected_param)
        return excel_download
    elif file_type == 'pdf':
        procedure_name = 'Procedure Code Summary For Procedure'
        excel_download = render_pdf('alithias/procedure_code_summary.html', {'json_data': final_data_list,'selected_param':selected_param}, procedure_name)
        return excel_download
    return HttpResponse(data, content_type='application/json')
    #return HttpResponse(strd_data_list)

def cost_comparison_summary(request):
    """CompanyID,SourceZIP,MilesRadius,UserID,Year,MemberPopulation"""
    file_type = request.GET.get('file_type', '')
    try:
        company_id = request.GET['CompanyID']
    except:
        company_id = 1094
    try:
        source_zip = request.GET['SourceZIP']
    except:
        source_zip = 53711
    try:
        miles_radius = request.GET['MilesRadius']
    except:
        miles_radius = 30
    try:
        user_id = request.GET['UserID']
    except:
        user_id = 184
    try:
        year = request.GET['Year']
    except:
        year = 2016
    try:
        member_population = request.GET['MemberPopulation']
    except:
        member_population = 1000
    params = [company_id,source_zip,miles_radius,user_id,year,member_population]
    #strd_data_list = stored_procedure_calling('rptProcedureCostComparisonSummaryProjection2', params)
    #strd_data_list = stored_procedure_calling('rptProcedureCostComparisonSummaryProjection3', params)
    strd_data_list = stored_procedure_calling_list('rptProcedureCostComparisonSummaryProjection3', params)
    final_cmp_list = []
    final_cmp_data = {}
    cmp_estimated = 0
    cmp_total_cost = 0
    cmp_pt_saving = 0
    for cst_dict in strd_data_list:
        avg_total = float('%.2f' % round(float(cst_dict['col_8']), 0))
        cst_dict['col_8'] = str(format(avg_total, '0,.0f'))
        cst_dict['col_7'] = int(float(cst_dict['col_7']))
        est_total = float('%.2f' % round(float(cst_dict['col_18']), 0))
        cst_dict['col_18'] = str(format(est_total, '0,.0f'))
        """import pdb;pdb.set_trace()
        if ',' not in str(cst_dict['col_17']):
            low_total = float('%.2f' % round(float(cst_dict['col_17']), 0))
            cst_dict['col_17'] = str(format(low_total, '0,.0f'))"""
        cst_dict['col_17'] = str(cst_dict['col_17'].split('.')[0] + '.00')
        cmp_estimated = cmp_estimated + est_total
        tl_cost = float('%.2f' % round(float(cst_dict['col_19']), 0))
        cst_dict['col_19'] = str(format(tl_cost, '0,.0f'))
        cmp_total_cost = cmp_total_cost + tl_cost
        pt_cost = float('%.2f' % round(float(cst_dict['col_21']), 0))
        cst_dict['col_21'] = str(format(tl_cost, '0,.0f'))
        cmp_pt_saving = cmp_pt_saving + pt_cost
        #claim_count = claim_count + int(cst_dict['col_6'])
    final_cmp_data['cmp_data'] = strd_data_list
    final_cmp_data['cmp_estimated'] = str(format(cmp_estimated, '0,.0f'))
    final_cmp_data['cmp_total_cost'] = str(format(cmp_total_cost, '0,.0f'))
    final_cmp_data['cmp_pt_saving'] = str(format(cmp_pt_saving, '0,.0f'))
    final_cmp_list.append(final_cmp_data)
    data = json.dumps(final_cmp_list)
    selected_param = {}
    selected_param['CompanyID'] = request.GET.get('CompanyID', '')
    selected_param['Company Name'] = request.GET.get('companyName', '')
    selected_param['SourceZIP'] = request.GET.get('SourceZIP', '')
    selected_param['Year'] = request.GET.get('Year', '')
    selected_param['MilesRadius'] = request.GET.get('MilesRadius', '')
    if file_type == 'excel':
        header = ['Procedure','Episodes','AverageCharge(30 Miles)','EstimatedTotalCost','LowCost(30 Miles)'
                ,'TotalCost(30 Miles)','PotentialSavings(30 Miles)','LowCostProvider(30 Miles)','Network']
        column_mapping_dict = {'Procedure':'col_5','Episodes':'col_7','AverageCharge(30 Miles)':'col_8','EstimatedTotalCost':'col_18',
                               'LowCost(30 Miles)':'col_17','TotalCost(30 Miles)':'col_19','PotentialSavings(30 Miles)':'col_21',
                               'LowCostProvider(30 Miles)':'col_13', 'Network':'col_14'}
        procedure_name = 'Cost Comparison Summary'
        excel_download = common_excel_generation(header, column_mapping_dict, procedure_name, final_cmp_list,selected_param)
        return excel_download
    elif file_type == 'pdf':
        procedure_name = 'Cost Comparison Summary'
        excel_download = render_pdf('alithias/cost_comparison_summary.html', {'json_data': final_cmp_list, 'selected_param':selected_param}, procedure_name)
        return excel_download
    # return final_api_list
    return HttpResponse(data, content_type='application/json')

def Procedure_Maintenance(request):
    try:
        db_action_type = request.GET['db_action_type']
    except:
        db_action_type = 'all'
    if db_action_type == 'all':
        params = []
        sp = 'Procedure_SelectAll'
    elif db_action_type == 'delete':
        try:
            procedure_id = request.GET['ProcedureID']
        except:
            procedure_id = '888888'
        params = [procedure_id]
        sp = 'Procedure_Delete'
    elif db_action_type in ['update','create']:
        """ProcedureID,ProcedureName,IsOutpatient,Enabled,RequireFacility,RequirePhysician
        ,RequireAnesthesia,RequireLab,RequireRadiology"""
        try:
            procedure_id = request.GET['ProcedureID']
        except:
            procedure_id ='45454545'
        try:
            procedure_name = request.GET['ProcedureName']
        except:
            procedure_name = 'new Trail test success'
        try:
            is_outpatient = request.GET['IsOutpatient']
        except:
            is_outpatient = 0
        try:
            enabled = request.GET['Enabled']
        except:
            enabled = 0
        try:
            require_facility = request.GET['RequireFacility']
        except:
            require_facility = 0
        try:
            require_physician = request.GET['RequirePhysician']
        except:
            require_physician = 1
        try:
            require_anesthesia = request.GET['RequireAnesthesia']
        except:
            require_anesthesia = 0
        try:
            require_lab = request.GET['RequireLab']
        except:
            require_lab = 0
        try:
            require_radiology = request.GET['RequireRadiology']
        except:
            require_radiology = 0
        params = [procedure_id,procedure_name,enabled,is_outpatient,require_facility,require_physician,require_anesthesia,require_lab,require_radiology]
        #params = [procedure_id, procedure_name,is_outpatient,enabled,require_facility, require_physician,require_anesthesia, require_lab, require_radiology]
        if db_action_type == 'update':
            sp = 'Procedure_Update'
        else:
            sp = 'Procedure_Insert'
    strd_data_list = stored_procedure_calling(sp, params)
    return HttpResponse(strd_data_list)

def Procedure_Mapping_Maintenance(request):
    try:
        db_action_type = request.GET['db_action_type']
    except:
        db_action_type = 'all'
    if db_action_type == 'all':
        try:
            procedure_id = request.GET['ProcedureID']
        except:
            procedure_id = '4513'
        params = [procedure_id]
        sp = 'ProcedureMapping_SelectAll'
    elif db_action_type == 'delete':
        try:
            mapping_id = request.GET['MappingID']
        except:
            mapping_id = '4513'
        params = [mapping_id]
        sp = 'ProcedureMapping_Delete'
    elif db_action_type in ['update','create']:
        """ProcedureID,ProcedureCode,IsPrimary,IsSecondary"""
        try:
            procedure_id = request.GET['ProcedureID']
        except:
            procedure_id = '4513'
        try:
            procedure_code = request.GET['ProcedureCode']
        except:
            procedure_code = '83037'
        try:
            is_primary = request.GET['IsPrimary']
        except:
            is_primary = 'false'
        try:
            is_secondary = request.GET['IsSecondary']
        except:
            is_secondary = 'false'
        try:
            mapping_id = request.GET['MappingID']
        except:
            mapping_id = '1696'
        if db_action_type == 'update':
            sp = 'ProcedureMapping_Update'
            params = [mapping_id, procedure_code, is_primary, is_secondary]
        else:
            sp = 'ProcedureMapping_Insert'
            params = [procedure_id, procedure_code, is_primary, is_secondary]
    strd_data_list = stored_procedure_calling(sp, params)
    return HttpResponse(strd_data_list)

def Provider_Maintenance(request):
    try:
        db_action_type = request.GET['db_action_type']
    except:
        db_action_type = 'all'
    if db_action_type == 'all':
        params = []
        sp = 'Provider_SelectAll'
    elif db_action_type == 'update':
        try:
            provider_npi = request.GET['ProviderNPI']
        except:
            provider_npi = '1750603296'
        try:
            provider_name = request.GET['ProviderName']
        except:
            provider_name = 'LIGHT PRENATAL CARE CENTER trail'
        try:
            provider_tax_id = request.GET['ProviderTaxID']
        except:
            provider_tax_id = ''
        try:
            provider_type_code = request.GET['ProviderTypeCode']
        except:
            provider_type_code = 'PHYSICIAN'
        params = [provider_npi,provider_name,provider_tax_id,provider_type_code]
        sp = 'Provider_Update'
    strd_data_list = stored_procedure_calling(sp, params)
    return HttpResponse(strd_data_list)

def epi_rev_code(request):
    file_type = request.GET.get('file_type', '')
    """CompanyID,SourceZIP,MilesRadius,UserID,Year,MemberPopulation"""
    try :
        procedure_id = request.GET['ProcedureID']
    except:
        procedure_id = 1702
    try:
        facility_npi = request.GET['FacilityNPI']
    except:
        facility_npi = 1518993880
    try:
        patient_id = request.GET['PatientID']
    except:
        patient_id = '07f797279eebfa36f30241e3d1c1dbf8'
    try:
        first_date = request.GET['firstDateOfService']
        if 'GMT' not in first_date:
            yy = datetime.datetime.strptime(first_date, "%Y-%m-%d %H:%M:%S").date()
            first_date = datetime.datetime.strftime(yy, "%m/%d/%Y")
        else:
            val = first_date.split('00:00:00')[0].strip()
            date_values = val.split(' ')
            str_date = str(date_values[-1]+'-'+date_values[-3]+'-'+date_values[-2])
            yy = datetime.datetime.strptime(str_date, "%Y-%b-%d")
            first_date = datetime.datetime.strftime(yy, "%m/%d/%Y")
    except:
        first_date = '2/19/2010'
    params = [procedure_id,facility_npi,patient_id,first_date]
    strd_data_list = stored_procedure_calling_list('rptEpisodeDetailsRevCode', params)
    final_rev_list = []
    final_rev_data = {}
    billed_amt = 0
    allowed_amt = 0
    for rev_code in strd_data_list:
        bill_amt = float('%.2f' % round(float(rev_code['col_10']), 2))
        rev_code['col_10'] = str(format(bill_amt, '0,.0f'))
        billed_amt = billed_amt + bill_amt
        alw_amt = float('%.2f' % round(float(rev_code['col_11']), 2))
        rev_code['col_11'] = str(format(alw_amt, '0,.0f'))
        allowed_amt = allowed_amt + alw_amt

        # claim_count = claim_count + int(cst_dict['col_6'])
    final_rev_data['revenue_data'] = strd_data_list
    final_rev_data['total_ald_amount'] = str(format(billed_amt, '0,.0f'))
    final_rev_data['total_bil_amount'] = str(format(allowed_amt, '0,.0f'))
    final_rev_list.append(final_rev_data)

    selected_param = {}
    selected_param['first Date Of Service'] = request.GET.get('firstDateOfService', '')
    selected_param['Patient ID'] = request.GET.get('PatientID', '')
    selected_param['Procedure'] = request.GET.get('ProcedureID', '')
    selected_param['FacilityNPI'] = request.GET.get('FacilityNPI', '')

    if file_type == 'excel':
        header = ['RevCode','Description','Modifier1','Modifier2','CostCategory','Billed Amount','Allowed Amount']
        column_mapping_dict = {'RevCode':'col_12','Description':'col_13','Modifier1':'col_8','Modifier2':'col_9',
                               'CostCategory':'col_14','Billed Amount':'col_10','Allowed Amount':'col_11'}
        procedure_name = 'Episode Revenue Code Details'
        excel_download = common_excel_generation(header, column_mapping_dict, procedure_name, final_rev_list,selected_param)
        return excel_download
    elif file_type == 'pdf':
        procedure_name = 'Episode Revenue Code Details'
        excel_download = render_pdf('alithias/episode_revenue_code.html', {'json_data': final_rev_list , 'selected_param':selected_param}, procedure_name)
        return excel_download
    data = json.dumps(final_rev_list)
    # return final_api_list
    return HttpResponse(data, content_type='application/json')

def common_excel_generation(header,column_mapping_dict,procedure_name,json_data,selected_param = {}):
    data_list = json_data
    import xlwt
    from xlwt import Workbook, Style
    from xlwt import Workbook, Formula
    output = StringIO.StringIO()
    todays_excel_file = xlwt.Workbook(encoding="utf-8")
    todays_excel_sheet1 = todays_excel_file.add_sheet(procedure_name)
    excel_file_name = output
    # todays_excel_sheet1.write(0, 1, 'Procedure pricing')
    if procedure_name == 'Episode Details':
        todays_excel_sheet1.write_merge(0, 0, 0, len(header) - 1, 'Procedure Provider Episode Details', Style.easyxf('font: bold on'))
    else:
        todays_excel_sheet1.write_merge(0, 0, 0, len(header) - 1, procedure_name, Style.easyxf('font: bold on'))
    todays_excel_sheet1.write_merge(1, 1, 0, len(header) - 1, '', Style.easyxf('font: bold on'))
    row_id = 2
    if selected_param:
        selected_values = ""
        for sel_key,sel_value in selected_param.iteritems():
            selected_values = "%s : %s " % (sel_key,sel_value)
            todays_excel_sheet1.write_merge(row_id, row_id, 0, len(header) - 1, selected_values, Style.easyxf('font: bold on'))
            row_id = row_id +1

    todays_excel_sheet1.write_merge(row_id, row_id, 0, len(header) - 1, '', Style.easyxf('font: bold on'))
    row_id = row_id+1

    if procedure_name in ['Procedure Pricing','Procedure Code Summary']:
        excel_insert = procedure_pricing_excel_insertion(data_list, header, column_mapping_dict, todays_excel_sheet1,row_id)
    elif procedure_name == 'Comany Network By State':
        excel_insert = cmp_network_excel_gen(data_list,header,column_mapping_dict,todays_excel_sheet1,row_id)
    elif procedure_name == 'Episode Details':
        excel_insert = episode_details_excel_gen(data_list,header,column_mapping_dict,todays_excel_sheet1,row_id)
    elif procedure_name == 'Cost Comparison Summary':
        excel_insert = cost_comparison_summary_excel_gen(data_list,header,column_mapping_dict,todays_excel_sheet1,row_id)
    elif procedure_name == 'Procedure Pricing Details':
        excel_insert = procedure_pricing_details_excel_gen(data_list,header,column_mapping_dict,todays_excel_sheet1,row_id)
    elif procedure_name == 'Provider Pricing details':
        excel_insert = provider_pricing_details_excel_gen(data_list,header,column_mapping_dict,todays_excel_sheet1,row_id)
    elif procedure_name == 'Episode Revenue Code Details':
        excel_insert = episode_revenue_excel_gen(data_list, header, column_mapping_dict, todays_excel_sheet1,row_id)

    todays_excel_file.save(excel_file_name)

    output.seek(0)
    response = HttpResponse(excel_file_name.read(),content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    response['Content-Disposition'] = "attachment; filename=%s.xls" % procedure_name
    return response

def procedure_pricing_excel_insertion(data_list,header,column_mapping_dict,todays_excel_sheet1,row_id):
    for i, row in enumerate(header):
        todays_excel_sheet1.write(row_id, i, row, Style.easyxf('font: bold on'))
    row_id = row_id + 1
    for data in data_list:
        for col_count, header_name in enumerate(header):
            todays_excel_sheet1.write(row_id, col_count, data[column_mapping_dict[header_name]])
        row_id = row_id + 1
    return todays_excel_sheet1

def cmp_network_excel_gen(data_list,header,column_mapping_dict,todays_excel_sheet1,row_id):
    for data in data_list:
        todays_excel_sheet1.write_merge(row_id, row_id, 0, len(header) - 1, "State : " + data['state_name'],Style.easyxf('font: bold on'))
        row_id = row_id + 1
        for i, row in enumerate(header):
            todays_excel_sheet1.write(row_id, i, row, Style.easyxf('font: bold on'))
        row_id = row_id + 1
        for st_rec in data['state_data']:
            for col_count, header_name in enumerate(header):
                todays_excel_sheet1.write(row_id, col_count, st_rec[column_mapping_dict[header_name]])
            row_id = row_id + 1
        todays_excel_sheet1.write(row_id, 0, "Total")
        todays_excel_sheet1.write(row_id, len(header) - 1, data['state_total'])
        row_id = row_id + 2
    return todays_excel_sheet1

def episode_details_excel_gen(data_list,header,column_mapping_dict,todays_excel_sheet1,row_id):
    for data in data_list:
        todays_excel_sheet1.write_merge(row_id, row_id, 0, len(header) - 1, "Episode Key :" + data['epi_key'],
                                        Style.easyxf('font: bold on'))
        row_id = row_id + 1
        for cst_ct in data['epi_data']:
            todays_excel_sheet1.write_merge(row_id, row_id, 0, len(header) - 1,
                                            "Cost Category : " + cst_ct['csct_type'], Style.easyxf('font: bold on'))
            row_id = row_id + 1
            for i, row in enumerate(header):
                todays_excel_sheet1.write(row_id, i, row, Style.easyxf('font: bold on'))
            row_id = row_id + 1
            for csct_data in cst_ct['csct_data']:
                csct_data['col_7'] = '$' + csct_data['col_7']
                csct_data['col_8'] = '$' + csct_data['col_8']
                for col_count, header_name in enumerate(header):
                    todays_excel_sheet1.write(row_id, col_count, csct_data[column_mapping_dict[header_name]])
                row_id = row_id + 1
            todays_excel_sheet1.write(row_id, 0, 'Total ' + cst_ct['csct_type'])
            todays_excel_sheet1.write(row_id, len(header) - 1, '$' + cst_ct['csct_allowed_total'])
            todays_excel_sheet1.write(row_id, len(header) - 2, '$' + cst_ct['csct_retail_total'])
            row_id = row_id + 1
        todays_excel_sheet1.write(row_id, 0, 'Episode Total')
        todays_excel_sheet1.write(row_id, len(header) - 1, '$' + data['epi_allowed_total'])
        todays_excel_sheet1.write(row_id, len(header) - 2, '$' + data['epi_retail_total'])
        row_id = row_id + 1
        todays_excel_sheet1.write_merge(row_id, row_id, 0, len(header) - 1,"" , Style.easyxf('font: bold on'))
        row_id = row_id + 1
    return todays_excel_sheet1

def cost_comparison_summary_excel_gen(data_list,header,column_mapping_dict,todays_excel_sheet1,row_id):
    for i, row in enumerate(header):
        todays_excel_sheet1.write(row_id, i, row, Style.easyxf('font: bold on'))
    row_id = row_id + 1

    for data in data_list[0]['cmp_data']:
        data['col_8'] = '$' + data['col_8']
        data['col_18'] = '$' + data['col_18']
        data['col_19'] = '$' + data['col_19']
        data['col_21'] = '$' + data['col_21']
        for col_count, header_name in enumerate(header):
            todays_excel_sheet1.write(row_id, col_count, data[column_mapping_dict[header_name]])
        row_id = row_id + 1
    todays_excel_sheet1.write(row_id, 0 , 'Grand Total')
    todays_excel_sheet1.write(row_id, len(header) - 6, '$' + data_list[0]['cmp_estimated'])
    todays_excel_sheet1.write(row_id, len(header) - 4, '$' + data_list[0]['cmp_total_cost'])
    todays_excel_sheet1.write(row_id, len(header) - 3, '$' + data_list[0]['cmp_pt_saving'])
    return todays_excel_sheet1

def procedure_pricing_details_excel_gen(data_list,header,column_mapping_dict,todays_excel_sheet1,row_id):
    for data in data_list:
        todays_excel_sheet1.write_merge(row_id, row_id, 0, len(header) - 1, data['category_name'],Style.easyxf('font: bold on'))
        row_id = row_id + 1
        for i, row in enumerate(header):
            todays_excel_sheet1.write(row_id, i, row, Style.easyxf('font: bold on'))
        row_id = row_id + 1

        for r_data in data['category_data']:
            r_data['col_7'] = '$' + r_data['col_7']
            for col_count, header_name in enumerate(header):
                todays_excel_sheet1.write(row_id, col_count, r_data[column_mapping_dict[header_name]])
            row_id = row_id + 1
    return todays_excel_sheet1

def provider_pricing_details_excel_gen(data_list,header,column_mapping_dict,todays_excel_sheet1,row_id):
    for i, row in enumerate(header):
        todays_excel_sheet1.write(row_id, i, row, Style.easyxf('font: bold on'))
    row_id = row_id + 1

    for data in data_list['data']:
        for col_count, header_name in enumerate(header):
            todays_excel_sheet1.write(row_id, col_count, data[column_mapping_dict[header_name]])
        row_id = row_id + 1
    todays_excel_sheet1.write(row_id, len(header) - 2, 'Typical Provider Episode Cost:')
    todays_excel_sheet1.write(row_id, len(header)-1, data_list['factor_total'])
    return todays_excel_sheet1

def episode_revenue_excel_gen(data_list, header, column_mapping_dict, todays_excel_sheet1,row_id):
    for i, row in enumerate(header):
        todays_excel_sheet1.write(row_id, i, row, Style.easyxf('font: bold on'))
    row_id = row_id + 1
    if len(data_list) > 0:
        for data in data_list:
            for rev_data in data['revenue_data']:
                rev_data['col_10'] = '$' + rev_data['col_10']
                rev_data['col_11'] = '$' + rev_data['col_11']
                for col_count, header_name in enumerate(header):
                    todays_excel_sheet1.write(row_id, col_count, rev_data[column_mapping_dict[header_name]])
                row_id = row_id + 1
            todays_excel_sheet1.write(row_id, 0, 'Grand Total')
            todays_excel_sheet1.write(row_id, len(header)-1, '$' + data['total_bil_amount'])
            todays_excel_sheet1.write(row_id, len(header) - 2,'$' + data['total_ald_amount'])
    return todays_excel_sheet1

def common_excel_generation_old(header,column_mapping_dict,procedure_name,json_data):
    data_list = json_data
    import xlwt
    from xlwt import Workbook, Style
    from xlwt import Workbook, Formula
    output = StringIO.StringIO()


    todays_excel_file = xlwt.Workbook(encoding="utf-8")
    todays_excel_sheet1 = todays_excel_file.add_sheet("sheet1")
    excel_file_name = output
    # todays_excel_sheet1.write(0, 1, 'Procedure pricing')
    todays_excel_sheet1.write_merge(0, 0, 0, len(header) - 1, procedure_name, Style.easyxf('font: bold on'))
    row_id = 1
    for i, row in enumerate(header):
        todays_excel_sheet1.write(row_id, i, row, Style.easyxf('font: bold on'))
    row_id = row_id + 1

    for data in data_list:
        for col_count, header_name in enumerate(header):
            todays_excel_sheet1.write(row_id, col_count, data[column_mapping_dict[header_name]])
        row_id = row_id + 1
    todays_excel_file.save(excel_file_name)

    output.seek(0)
    response = HttpResponse(excel_file_name.read(),content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    response['Content-Disposition'] = "attachment; filename=%s.xls" % procedure_name
    return response

def excel_trail(request):
    output = StringIO.StringIO()

    book = Workbook(output)
    sheet = book.add_worksheet('test')
    sheet.write(0, 0, 'Hello, thias alithias trail')
    book.close()

    # construct response
    output.seek(0)
    response = HttpResponse(output.read(), content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    response['Content-Disposition'] = "attachment; filename=test.xlsx"

    return response