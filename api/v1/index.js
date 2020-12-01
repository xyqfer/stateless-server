const router = require('express').Router();

router.get('/youtube/proxy/:id', require('./youtube/proxy'));

router.get('/hn/item', require('./hn/item'));
router.get('/hn/news', require('./hn/news'));
router.get('/hn/random', require('./hn/random'));
router.get('/hn/links', require('./hn/links'));
router.get('/hn/story', require('./hn/story'));
router.get('/hn/ask', require('./hn/ask'));
router.get('/hn/askRandom', require('./hn/askRandom'));
router.get('/hn/showHistory', require('./hn/showHistory'));
router.get('/hn/allProjects', require('./hn/allProjects'));

const {
  hot: v2exHot,
  new: v2exNew,
  nodes: v2exNodes,
  node: v2exNode,
  t: v2exT,
  tab: v2exTab,
  member: v2exMember,
  memberTopic: v2exMemberTopic,
  memberReply: v2exMemberReply,
  login: v2exLogin,
  logout: v2exLogout,
  initLogin: v2exInitLogin,
  search: v2exSearch,
  recent: v2exRecent,
  checkLogin: v2exCheckLogin,
  tag: v2exTag,
  allNodes: v2exAllNodes,
} = require('./v2ex');

router.get('/v2ex/hot', v2exHot);
router.get('/v2ex/new', v2exNew);
router.get('/v2ex/nodes', v2exNodes);
router.get('/v2ex/all-nodes', v2exAllNodes);
router.get('/v2ex/node/:name', v2exNode);
router.get('/v2ex/member/:name', v2exMember);
router.get('/v2ex/member/:name/topic', v2exMemberTopic);
router.get('/v2ex/member/:name/reply', v2exMemberReply);
router.get('/v2ex/t/:id', v2exT);
router.get('/v2ex/tab/:name', v2exTab);
router.get('/v2ex/tag/:name', v2exTag);
router.get('/v2ex/login/init', v2exInitLogin);
router.post('/v2ex/login', v2exLogin);
router.post('/v2ex/logout', v2exLogout);
router.get('/v2ex/search', v2exSearch);
router.get('/v2ex/recent', v2exRecent);
router.get('/v2ex/checkLogin', v2exCheckLogin);

router.get('/theinitium/article', require('./theinitium/article'));
router.get('/theinitium/channel/:name', require('./theinitium/channel'));

router.get('/coolapk/feed/:id', require('./coolapk/feed'));

router.get('/caixin/article', require('./caixin/article'));
router.get('/caixin/magazine', require('./caixin/magazine'));

router.get('/infoq/article', require('./infoq/article'));

module.exports = router;
