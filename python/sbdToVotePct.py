import sys
from beem import Steem
steem = Steem("https://api.steemit.com")

_sbd = (sys.argv[1])
_prs = float(sys.argv[2])
_sp = float(sys.argv[3])
_vp = float(sys.argv[4])
_sbd = _sbd + " SBD"


# sbdParam = float(_sbd) + " SBD"
perc = steem.sbd_to_vote_pct(sbd=_sbd,post_rshares=_prs,steem_power=_sp,vests=None,voting_power=_vp,not_broadcasted_vote=True,use_stored_data=True)

print(perc)