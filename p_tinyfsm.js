var out = async (init_opts,init_fsm,init_step_name) => out.run(
	init_fsm ? {lgc:init_opts,fsm:init_fsm,step_name:init_step_name} : init_opts,
);
out.compile = (fsm_s,pt,m) => fsm_s.split(/[\n\r]+/).reduce(
	(r,e)=>(m=e.replace(/\s/g,'').match(/^(\w+)?(\.(\w*)=>(\w*))?/))&&(pt=m[1]||pt,pt&&(r[pt]=(r[pt]||{}),r[pt][m[3]]=m[4]),r),{}
);
out.run = async (init_opts={}) => {
	try{
		var {lgc,fsm,step_name,prev_rst,prev_sts,prev_name} = init_opts;
		var fsm_o = (typeof fsm=='object') ? fsm : out.compile(fsm);//console.log('fsm_o=',fsm_o);
		if(!step_name){ for(var nm in fsm_o){ if(nm){step_name=nm; break}} }
		do{
			var func_p = lgc[step_name];
			if(func_p){
				var rst = await func_p(prev_rst,prev_name,prev_sts);
				var STS = (rst||{}).STS;
				step_next = (fsm_o[step_name]||{})[STS];
				if(!step_next) return rst;
				prev_name = step_name;
				step_name = step_next;
				prev_sts = STS;
				prev_rst = rst;
			}else return {STS:'KO', errmsg:((prev_name)?`${prev_name}.${prev_sts}`:'')+(`=>${step_name} not found?`) };
		}while(true);
	}catch(err){
		return {STS:'KO',errmsg:(''+err),err};
	}
}
module.exports = out;
