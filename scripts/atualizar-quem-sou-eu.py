"""Atualiza apenas fatos de elencos, nunca baixa fotos ou escudos.

Uso: python scripts/atualizar-quem-sou-eu.py
Revisar diff, cobertura e transferências antes de publicar.
"""
import concurrent.futures
import datetime
import json
import pathlib
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parents[1]
API = 'https://site.api.espn.com/apis/site/v2/sports/soccer/'
LEAGUES = {'eng.1': 'Premier League', 'esp.1': 'LaLiga', 'ita.1': 'Serie A italiana',
           'ger.1': 'Bundesliga', 'fra.1': 'Ligue 1', 'bra.1': 'Brasileirão Série A 2026'}

def get(path):
    request = urllib.request.Request(API + path, headers={'User-Agent': 'OPC roster factual research'})
    with urllib.request.urlopen(request, timeout=60) as response:
        return json.load(response)

def roster(pair):
    league, team = pair
    data = get(f'{league}/teams/{team["id"]}/roster')
    records = []
    for p in data.get('athletes', []):
        number = p.get('jersey', '')
        records.append({'id': str(p['id']), 'name': p['displayName'], 'league': league,
                        'club': team['displayName'], 'clubId': str(team['id']),
                        'nationality': p.get('citizenship') or None,
                        'birth': p.get('dateOfBirth', '')[:10] or None,
                        'number': int(number) if str(number).isdigit() else None,
                        'group': p.get('position', {}).get('abbreviation', '?'),
                        'source': next((l['href'] for l in p.get('links', []) if 'playercard' in l.get('rel', [])),
                                       f'https://www.espn.com/soccer/team/squad/_/id/{team["id"]}')})
    return {'league': league, 'id': str(team['id']), 'name': team['displayName'],
            'season': data.get('season', {}).get('displayName'), 'players': records,
            'source': API + f'{league}/teams/{team["id"]}/roster'}

def main():
    pairs = []
    for league in LEAGUES:
        data = get(league + '/teams?limit=100')
        teams = data['sports'][0]['leagues'][0]['teams']
        pairs.extend((league, t['team']) for t in teams)
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
        clubs = list(pool.map(roster, pairs))
    if any(not c['players'] for c in clubs):
        raise RuntimeError('Elenco vazio: atualização abortada para preservar a base anterior')
    # IDs must also be unique across leagues in the combined mode.
    # Snapshot-specific corrections expire on the next day until reviewed again.
    updated = datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=-3))).date().isoformat()
    corrections = json.loads((ROOT / 'docs/quem-sou-eu-correcoes.json').read_text(encoding='utf-8'))
    valid_corrections = {c['id']: c for c in corrections if c['verifiedAt'] == updated}
    players, conflicts, resolutions = {}, [], []
    listed_records = sum(len(club['players']) for club in clubs)
    for club in clubs:
        for player in club.pop('players'):
            key = player['id']
            if key in players:
                correction = valid_corrections.get(key)
                if correction and correction['clubId'] in [players[key]['clubId'], player['clubId']]:
                    if player['clubId'] == correction['clubId']:
                        players[key] = player
                    resolutions.append(correction)
                else:
                    conflicts.append({'id': key, 'name': player['name'],
                                      'clubs': [players[key]['club'], player['club']]})
            else:
                players[key] = player
    conflicting = {c['id'] for c in conflicts}
    positions = json.loads((ROOT / 'docs/quem-sou-eu-posicoes.json').read_text(encoding='utf-8'))
    complete, excluded = [], {'nationality': 0, 'birth': 0, 'number': 0, 'position': 0}
    for key, player in players.items():
        if key in conflicting:
            continue
        player['position'] = 'GOL' if player['group'] == 'G' else positions.get(player['id'])
        missing = [field for field in excluded if player.get(field) is None]
        if missing:
            for field in missing:
                excluded[field] += 1
            continue
        complete.append(player)
    result = {'updated': updated, 'excluded': excluded,
              'listedRecords': listed_records,
              'leagues': LEAGUES, 'clubs': clubs, 'conflicts': conflicts, 'resolutions': resolutions,
              'players': complete}
    target = ROOT / 'quem-sou-eu-dados.js'
    target.write_text('// Fatos de elencos; fontes e limitações em docs/quem-sou-eu.md.\n'
                      'globalThis.OPC_PLAYERS = ' + json.dumps(result, ensure_ascii=False, separators=(',', ':')) + ';\n', encoding='utf-8')
    print(f'{len(clubs)} clubes, {len(result["players"])} jogadores, {len(conflicts)} conflitos registrados.')

if __name__ == '__main__':
    main()
