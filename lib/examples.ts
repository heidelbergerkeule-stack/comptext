export interface Example {
  id: string;
  name: string;
  code: string;
}

export const EXAMPLES: Example[] = [
  {
    id: 'fastapi',
    name: 'FastAPI',
    code: 'CMD:CODE;LNG:PY;FRM:FAST;AUTH:JWT;DB:PSQL;CRUD:USER,PRODUCT',
  },
  {
    id: 'react',
    name: 'React UI',
    code: 'CMD:UI;TYP:DASHBOARD;FRM:REACT;LNG:TS;STYLE:TW;RESP:Y',
  },
  {
    id: 'test',
    name: 'Test Suite',
    code: 'CMD:TEST;LNG:PY;FRM:PYTEST;TYP:UNIT,INTEG;COV:90',
  },
  {
    id: 'docker',
    name: 'Docker',
    code: 'CMD:DOCK;LNG:PY;STG:MULTI;OPT:SIZE',
  },
  {
    id: 'pipeline',
    name: 'Pipeline',
    code: 'CMD:CODE;LNG:PY|CMD:TEST;COV:80|CMD:DOCK;OPT:SIZE',
  },
  {
    id: 'parallel',
    name: 'Parallel',
    code: 'CMD:CODE;LNG:PY&CMD:CODE;LNG:TS&CMD:CODE;LNG:GO',
  },
  {
    id: 'k8s',
    name: 'Kubernetes',
    code: 'CMD:K8S;DEPL:3;SVC:LB;HPA:Y;ING:TLS',
  },
  {
    id: 'ml',
    name: 'ML Pipeline',
    code: 'CMD:PREP;SRC:CSV;EDA:Y|CMD:TRAIN;MDL:XGB;CV:5|CMD:EVAL;METRIC:F1,AUC',
  },
];