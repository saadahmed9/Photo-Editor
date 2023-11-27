
#inmemory dictionary values
dict_statistics = {}
functionality_list = ['resize']
for i in functionality_list:
    dict_statistics[i] = 0
def get_stats_inmemory(function_called = "statistics"):
    if(function_called != "statistics"):
        dict_statistics[function_called] = dict_statistics[function_called] + 1
    return dict_statistics
