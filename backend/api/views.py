from django.shortcuts import render
from django.http import HttpResponse
import pyodbc
import json
#from django.utils import simplejson

def index(request):
    return render(request, "alithias/index.html")


def dropdown_queries(table_info):
    connection = pyodbc.connect('Driver={SQL Server};Server=localhost;Database=Alithias_Core_V3;UID="";PWD="";Trusted_Connection=yes')
    cursor = connection.cursor()
    #import pdb;pdb.set_trace()
    #sql = 'SELECT ProcedureName FROM Procedures'
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
    #data = json.dumps(final_api_list)
    #return HttpResponse(data, content_type='application/json')
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
    #import pdb;pdb.set_trace()
    #sql = 'SELECT ProcedureName FROM Procedures'
    tables_data = {}
    for table_name,table_val in table_info.iteritems():
        if table_name =='Networks':
            sql = 'SELECT {0},{1} FROM {2} where NetworkID>1000'.format(table_val[0], table_val[1], table_name)
        else:
            sql = 'SELECT {0},{1} FROM {2}'.format(table_val[0],table_val[1],table_name)
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

def procedure_pricing_dropdowns_old(request):
    dropdown_info = {}
    dropdown_info['Procedures']="ProcedureName"
    dropdown_info['Networks'] = "NetworkName"

    us_states = ["WI","Boston"]
    dd_data = dropdown_queries(dropdown_info)
    dd_data[0]['states'] = us_states
    data = json.dumps(dd_data)
    return HttpResponse(data, content_type='application/json')

def procedure_pricing_dropdowns(request):
    dropdown_info = {}
    dropdown_info['Procedures']=["ProcedureName","ProcedureID"]
    dropdown_info['Networks'] = ["NetworkName","NetworkID"]
    us_states = {"WI":"Wisconsin","Ut":"Utah"}
    #import pdb;pdb.set_trace()
    dd_data = dropdown_queries_new(dropdown_info)
    dd_data[0]['states'] = us_states
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
    dropdown_info['Networks'] = ["NetworkName","NetworkID"]
    dd_data = dropdown_queries_new(dropdown_info)
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
    dropdown_info['Companies'] = "CompanyID"
    dropdown_info['ZIPCodes'] = "ZIPCode"
    dd_data = dropdown_queries(dropdown_info)
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


    #sql = "exec rptProcedurePricing '%s', '%s', '%s', '%s', '%s', '%s', '%s'" % params
    #sql = "exec rptProcedurePricing %s, %s, %s, %s, %s, %s, %s" % params
    sql = st_query % tuple(stored_procedure_parameters)
    print sql
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
            final_api_dict[tb_col] = field
            local_count = local_count+1
            print field
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
    print sql
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
            local_count = local_count+1
            print field
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
    print sql
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
            print field
    #connection.close()
    return strd_data_list

def procedure_pricing(request):

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
    #params = [1119, 2010, '', 1, 'false', 'WI', 184]
    strd_data_list = stored_procedure_calling_list('rptProcedurePricing', params)
    column_names = ['col_6','col_7','col_8','col_9','col_10','col_11','col_24','col_25','col_26']
    new_data_list = adding_dollar(strd_data_list, column_names)
    data = json.dumps(new_data_list['dollar_col'])
    return HttpResponse(data, content_type='application/json')

    return HttpResponse(strd_data_list)


def procedure_pricing_breakdown(request):
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
    try :
        procedure_id = request.GET['ProcedureID']
    except:
        #procedure_id = 1901
        procedure_id = 2303
    try :
        network_id = request.GET['NetworkID']
    except:
        network_id = 2019
    try:
        provider_npi = request.GET['ProviderNPI']
    except:
        provider_npi = 1881645364
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
    #import pdb;pdb.set_trace()
    factor_claim_data = {}
    column_names = ['col_24','col_18','col_12']
    """cost_count = 0
    new_data_list = []
    for data_dict in strd_data_list:
        cost_count = cost_count + float(data_dict['col_24'])
        local_dict = {}
        for dt_key,dt_value in data_dict.iteritems():
            if dt_key in ['col_24','col_18','col_12']:
                local_dict[dt_key] = '$'+str(dt_value)
            else:
                local_dict[dt_key] = dt_value
        new_data_list.append(local_dict)"""

    final_factor_cost = []
    new_data_list = adding_dollar(strd_data_list,column_names)
    for n_dict in new_data_list['dollar_col']:
        round_value = float('%.2f' % round(float(new_data_list['cost_count']), 2))
        n_dict['total'] = '$'+str(round_value)
        final_factor_cost.append(n_dict)

    factor_claim_data['data'] = final_factor_cost
    #factor_claim_data['total'] = cost_count
    data = json.dumps(factor_claim_data)
    return HttpResponse(data, content_type='application/json')
    #return HttpResponse(strd_data_list)

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
                    accuracy_agg = 0
                else:
                    accuracy_agg = float('%.2f' % round(float(dt_value), 2))
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
    start_date,end_date,company_id,patient_id,first_data_service,procedure_code = '','','','','',''
    try :
        procedure_id = request.GET['ProcedureID']
    except:
        #procedure_id = 1901
        procedure_id = 1805
    try :
        network_id = request.GET['NetworkID']
    except:
        network_id = 2019
    try:
        facility_npi = request.GET['FacilityNPI']
    except:
        #facility_npi = 1013995521
        facility_npi = 1861447179
    params = [start_date,end_date,procedure_id,network_id,company_id,facility_npi,patient_id,first_data_service,procedure_code]
    #strd_data_list = stored_procedure_calling('rptEpisodeDetails', params)
    #import pdb;pdb.set_trace()
    strd_data_list = stored_procedure_calling_list('rptEpisodeDetails', params)
    epi_name = {}
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
                    rt_amt = float('%.2f' % round(float(csct_dict['col_7']), 2))
                    allowd_amt = float('%.2f' % round(float(csct_dict['col_8']), 2))
                    cc_retail_total = cc_retail_total + rt_amt
                    cc_allowed_total = cc_allowed_total + allowd_amt
                    epi_key = str(csct_dict['col_6']) + str(csct_dict['col_10'])
                cc_dict['facility_type'] = cc_key
                cc_dict['csct_data'] = cc_values
                cc_dict['csct_retail_total'] = str(cc_retail_total)
                ep_cc_rtl_total = ep_cc_rtl_total + cc_retail_total
                cc_dict['csct_allowed_total'] = str(cc_allowed_total)
                ep_cc_allowed_total = ep_cc_allowed_total + cc_allowed_total
                ep_cc_list.append(cc_dict)
            ep_cc_dict['epi_key'] = epi_key
            ep_cc_dict['epi_data'] = ep_cc_list
            ep_cc_dict['epi_retail_total'] = str(ep_cc_rtl_total)
            ep_cc_dict['epi_allowed_total'] = str(ep_cc_allowed_total)
            final_epi_details.append(ep_cc_dict)

    data = json.dumps(final_epi_details)
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
        final_claim_data[st_name] = st_values
        final_claim_data[st_name+'_total'] = claim_count
        state_dict['state_name'] = st_name
        state_dict['state_data'] = st_values
        state_dict['state_total'] = claim_count
        final_claim_list.append(state_dict)

    data = json.dumps(final_claim_list)

    #return final_api_list
    return HttpResponse(data, content_type='application/json')
    # return final_api_data
    #return HttpResponse(strd_data_list)

def pr_code_summary(request):
    """ProcedureID,CompanyID,ProviderTypeCode"""
    """try:
        company_id = request.GET['CompanyID']
    except:
        company_id =130"""
    try :
        procedure_id = request.GET['ProcedureID']
    except:
        procedure_id = 2604
        #procedure_id = 1901
        #procedure_id = 2901
    try:
        pr_type_code = request.GET['ProviderTypeCode']
    except:
        pr_type_code = ''
    state = ''
    params = [procedure_id,0,pr_type_code]
    strd_data_list = stored_procedure_calling('rptProcedureCodeSummaryForProcedure', params)
    return HttpResponse(strd_data_list)

def cost_compariosn_summary(request):
    """CompanyID,SourceZIP,MilesRadius,UserID,Year,MemberPopulation"""
    try:
        company_id = request.GET['CompanyID']
    except:
        #company_id = ''
        company_id = 1094
        #company_id = 1
    try:
        source_zip = request.GET['SourceZIP']
    except:
        #source_zip = 53081
        source_zip = 53711
        #source_zip = 53715
    try:
        miles_radius = request.GET['MilesRadius']
    except:
        miles_radius = 30
    try:
        user_id = request.GET['UserID']
    except:
        user_id = 184
        #user_id = 0
    try:
        year = request.GET['Year']
    except:
        #year = 2013
        year = 2016
    try:
        member_population = request.GET['MemberPopulation']
    except:
        member_population = 0
        #member_population = 1000
    params = [company_id,source_zip,miles_radius,user_id,year,member_population]
    #strd_data_list = stored_procedure_calling('rptProcedureCostComparisonSummaryProjection2', params)
    strd_data_list = stored_procedure_calling('rptProcedureCostComparisonSummaryProjection3', params)
    return HttpResponse(strd_data_list)

def Procedure_Maintenance(request):
    try:
        db_action_type = request.GET['db_action_type']
    except:
        db_action_type = 'insert'
    if db_action_type == 'all':
        params = []
        sp = 'Procedure_SelectAll'
    elif db_action_type == 'delete':
        try:
            procedure_id = request.GET['ProcedureID']
        except:
            procedure_id = '4513'
        params = [procedure_id]
        sp = 'Procedure_Delete'
    elif db_action_type in ['update','insert']:
        """ProcedureID,ProcedureName,IsOutpatient,Enabled,RequireFacility,RequirePhysician
        ,RequireAnesthesia,RequireLab,RequireRadiology"""
        try:
            procedure_id = request.GET['ProcedureID']
        except:
            procedure_id ='88888'
        try:
            procedure_name = request.GET['ProcedureName']
        except:
            procedure_name = 'Trail test'
        try:
            is_outpatient = request.GET['IsOutpatient']
        except:
            is_outpatient = 'true'
        try:
            enabled = request.GET['Enabled']
        except:
            enabled = 'true'
        try:
            require_facility = request.GET['RequireFacility']
        except:
            require_facility = 'false'
        try:
            require_physician = request.GET['RequirePhysician']
        except:
            require_physician = 'true'
        try:
            require_anesthesia = request.GET['RequireAnesthesia']
        except:
            require_anesthesia = 'true'
        try:
            require_lab = request.GET['RequireLab']
        except:
            require_lab = 'false'
        try:
            require_radiology = request.GET['RequireRadiology']
        except:
            require_radiology = 'false'
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
        db_action_type = 'update'
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
    elif db_action_type in ['update','insert']:
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
            is_secondary = 'true'
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
            provider_name = 'LIGHT PRENATAL CARE CENTER '
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

