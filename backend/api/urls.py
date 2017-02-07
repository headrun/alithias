from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^procedure_pricing/', views.procedure_pricing, name='procedure_pricing'),
    url(r'^procedure_pricing_breakdown/', views.procedure_pricing_breakdown, name='procedure_pricing_breakdown'),
    url(r'^procedure_pricing_breakdown_cpt/', views.procedure_pricing_breakdown_cpt, name='procedure_pricing_breakdown_cpt'),
    url(r'^provider_pricing_breakdown_cpt/', views.provider_pricing_breakdown_cpt, name='provider_pricing_breakdown_cpt'),
    url(r'^procedure_pricing_episode/', views.procedure_pricing_episode, name='procedure_pricing_episode'),
    url(r'^company_network_by_state/', views.company_network_by_state, name='company_network_by_state'),
    url(r'^company_network_by_state_new/', views.company_network_by_state_new, name='company_network_by_state_new'),
    url(r'^pr_code_summary/', views.pr_code_summary, name='pr_code_summary'),
    url(r'^cost_comparison_summary/', views.cost_comparison_summary, name='cost_comparison_summary'),
    url(r'^epi_rev_code/', views.epi_rev_code, name='epi_rev_code'),
    url(r'^Procedure_Maintenance/$', views.Procedure_Maintenance, name='Procedure_Maintenance'),
    url(r'^Procedure_Mapping_Maintenance/$', views.Procedure_Mapping_Maintenance, name='Procedure_Mapping_Maintenance'),
    url(r'^Provider_Maintenance/$', views.Provider_Maintenance, name='Provider_Maintenance'),
    url(r'^proc_pricing_dropdowns/$', views.procedure_pricing_dropdowns, name='procedure_pricing_dropdowns'),
    url(r'^proc_pricing_breakdown_dropdowns/$', views.proc_pricing_breakdown_dropdowns, name='proc_pricing_breakdown_dropdowns'),
    url(r'^proc_pricing_episode_dropdowns/', views.proc_pricing_episode_dropdowns, name='proc_pricing_episode_dropdowns'),
    url(r'^cmp_network_by_state_dropdowns/$', views.cmp_network_by_state_dropdowns, name='cmp_network_by_state_dropdowns'),
    url(r'^proc_code_summary_proc_dropdowns/$', views.proc_code_summary_proc_dropdowns, name='proc_code_summary_proc_dropdowns'),
    url(r'^cost_cmpr_summary_dropdowns$', views.cost_cmpr_summary_dropdowns, name='cost_cmpr_summary_dropdowns'),
]
