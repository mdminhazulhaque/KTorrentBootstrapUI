/***
    KTorrentBootstrapUI, KTorrent WebInterface with Bootstrap Theme
    Copyright (C) 2016 Md. Minhazul Haque

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
***/
function refresh()
{
    clear_error(); 
    update_torrents();
}

function show_div(div)
{
    var divs = new Array('content',' torrent_details', 'torrent_load', 'settings');
    for(var d in divs) 
    {
        var element = document.getElementById(divs[d]);
        if(element)
        {
            if(divs[d] == div)
                element.style.display = "";
            else
                element.style.display = "none";
        }
    }
}

function redirect_to_login()
{
    window.location = "login.html";
}

function clear_error()
{
    var p = document.getElementById('error');
    p.style.display = "none";
}

function show_error(msg)
{
    var p = document.getElementById('error_text');
    p.innerHTML = "Error: " + msg;
    
    var d = document.getElementById('error');
    d.style.display = "block";
}

function update_torrents()
{
    clear_error();
    fetch_xml("data/torrents.xml", update_torrent_list, show_error);
}

function update_torrent_list(xmldoc)
{
    var newtable = document.createElement('table');
    newtable.setAttribute('id', 'torrent_list_table');
    newtable.setAttribute('style', 'width: 100%;');
    
    var torrents = xmldoc.getElementsByTagName('torrent');
    var i = 0;
    while(torrents[i]) 
    {
        var row = newtable.insertRow(i);
        var cell = row.insertCell(0);
        cell.appendChild(torrent_item_div(torrents[i],i));
        i++;
    }
    
    var oldtable = document.getElementById('torrent_list_table');
    oldtable.parentNode.replaceChild(newtable, oldtable);
}

function torrent_item_div(torrent, i) 
{
    var torrent_name = get_text_data(torrent,'name');
    var torrent_num_files = get_text_data(torrent,'num_files');
    var torrent_status = get_text_data(torrent,'status');        
    var torrent_bytes_downloaded = get_text_data(torrent,'bytes_downloaded');
    var torrent_total_bytes_to_download = get_text_data(torrent,'total_bytes_to_download');
    var torrent_bytes_uploaded = get_text_data(torrent,'bytes_uploaded');
    var torrent_download_rate = get_text_data(torrent,'download_rate');
    var torrent_upload_rate = get_text_data(torrent,'upload_rate');
    var torrent_num_peers = get_text_data(torrent,'num_peers');
    
    var div = document.createElement('div');
    div.setAttribute('class','row');
    
    var title;
    
    if(torrent_num_files == '<strong>0</strong>')
    {
        title = torrent_name;
    }
    else
    {
        title = '<a href="javascript:show_div(\'torrent_details\'); update_torrent_details(' + i + ');">' + torrent_name + '</a>';
    }
    
    div.innerHTML = '<div class="col-md-12"><ul class="list-group"><li class="list-group-item active">' + title + '</li>' +
    '<li class="list-group-item">Status: ' + torrent_status + '</li>' +
    '<li class="list-group-item">Downloaded: ' + torrent_bytes_downloaded + ' of ' + torrent_total_bytes_to_download + '</li>' +
    '<li class="list-group-item">Uploaded: ' + torrent_bytes_uploaded + '</li>' +
    '<li class="list-group-item">Speed: ' + torrent_download_rate + ' download, ' + torrent_upload_rate + ' upload</li>' +
    '<li class="list-group-item">Peers: ' + torrent_num_peers + '</li>' +
    '<li class="list-group-item"><div class="btn-group" role="group">' +
    '<a class="btn btn-success" href=\"javascript:do_action(\'start=' + i + '\')\">Start</a>' +
    '<a class="btn btn-warning" href=\"javascript:do_action(\'stop=' + i + '\')\">Stop</a>' +
    '<a class="btn btn-danger" href=\"javascript:do_action(\'remove=' + i + '\')\">Delete</a>' +
    '</div></li></ul></div>'
    
    return div;
}

function get_text_data(element, tag)
{
    var text_node;
    try
    {
        text_node = element.getElementsByTagName(tag)[0].firstChild.data;
    }
    catch(e)
    {
        text_node = '';
    }
    return '<strong>' + text_node + '</strong>';
}

function get_text(element,tag,strong) 
{
    var text_node;
    try 
    {
        text_node = document.createTextNode(element.getElementsByTagName(tag)[0].firstChild.data);
        if (strong)
        {
            var s = document.createElement('strong');
            s.appendChild(text_node);
            return s;
        }
    }
    catch (e) 
    {
        text_node = document.createTextNode('');
    }
    return text_node;
}

function beautify_torrent_details() 
{
    var table = document.getElementById('torrent_details_table');
    table.className = 'table';
}

