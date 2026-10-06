// Vercel serverless function: /api/panel?a=workflows | run | runs
// Env vars (Vercel → Project → Settings → Environment Variables):
//   GITHUB_TOKEN (required)  PAT with Actions read & write on the repo
//   REPO         (required)  e.g. "yourname/yourrepo"
//   REF          (optional)  branch to run on, default "main"
//   WORKFLOWS    (optional)  comma-separated allowed workflow files, e.g. "build.yml,deploy.yml"
//   ACCESS_CODE  (optional)  if set, visitors must enter it

const TOKEN = process.env.GIT_TOKEN || process.env.GITHUB_TOKEN || process.env.GH_TOKEN;

const gh = (path, opts = {}) =>
  fetch('https://api.github.com' + path, {
    ...opts,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: 'Bearer ' + TOKEN,
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'actions-panel',
      ...(opts.headers || {}),
    },
  });

async function allowedWorkflows() {
  const r = await gh(`/repos/${process.env.REPO}/actions/workflows`);
  if (!r.ok) throw new Error('GitHub error ' + r.status);
  const d = await r.json();
  const allow = (process.env.WORKFLOWS || '').split(',').map((s) => s.trim()).filter(Boolean);
  return d.workflows.filter(
    (w) => w.state === 'active' && (!allow.length || allow.includes(w.path.split('/').pop()))
  );
}

module.exports = async (req, res) => {
  const { ACCESS_CODE, REPO, REF } = process.env;
  const missing = [!TOKEN && 'GIT_TOKEN', !REPO && 'REPO'].filter(Boolean);
  if (missing.length)
    return res.status(500).json({ error: 'Missing Vercel environment variable: ' + missing.join(', ') + ' (add it for Production, then Redeploy)' });
  if (ACCESS_CODE && req.headers['x-access-code'] !== ACCESS_CODE)
    return res.status(401).json({ error: 'Unauthorized' });

  try {
    const action = req.query.a;

    if (action === 'workflows' && req.method === 'GET') {
      const list = await allowedWorkflows();
      return res.json({ workflows: list.map((w) => ({ id: w.id, name: w.name, path: w.path })) });
    }

    if (action === 'run' && req.method === 'POST') {
      const id = Number(req.body && req.body.workflow_id);
      if (!(await allowedWorkflows()).some((w) => w.id === id))
        return res.status(403).json({ error: 'Workflow not allowed' });
      const r = await gh(`/repos/${REPO}/actions/workflows/${id}/dispatches`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ref: REF || 'main' }),
      });
      if (r.status !== 204) {
        const e = await r.json().catch(() => ({}));
        return res.status(502).json({ error: e.message || 'GitHub error ' + r.status });
      }
      return res.json({ ok: true });
    }

    if (action === 'runs' && req.method === 'GET') {
      const r = await gh(`/repos/${REPO}/actions/runs?per_page=15`);
      if (!r.ok) return res.status(502).json({ error: 'GitHub error ' + r.status });
      const d = await r.json();
      return res.json({
        runs: d.workflow_runs.map((x) => ({
          id: x.id, name: x.name, run_number: x.run_number, status: x.status,
          conclusion: x.conclusion, html_url: x.html_url, branch: x.head_branch, created_at: x.created_at,
        })),
      });
    }

    return res.status(404).json({ error: 'Not found' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
