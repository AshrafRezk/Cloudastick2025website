import { motion } from 'framer-motion';
import { Award, CheckCircle2 } from 'lucide-react';
import { usePortalUser } from '../contexts/PortalUserContext';
import { Card, CardContent } from './ui/card';

const CompletedBadges = () => {
  const { completed } = usePortalUser();

  // Filter to show only completed child materials (not parent modules)
  const completedChildren = completed.filter(instance => 
    instance.material?.isChild === true
  );

  if (completedChildren.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
        <Award className="w-6 h-6 text-yellow-500" />
        Completed Badges ({completedChildren.length})
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {completedChildren.map((instance, index) => (
          <motion.div
            key={instance.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20 hover:border-green-500/40 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground mb-1 line-clamp-2">
                      {instance.material?.title || 'Completed Material'}
                    </h3>
                    {instance.completedOn && (
                      <p className="text-xs text-muted-foreground">
                        Completed {new Date(instance.completedOn).toLocaleDateString()}
                      </p>
                    )}
                    {instance.score !== null && (
                      <p className="text-sm font-medium text-green-600 mt-1">
                        Score: {instance.score}%
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CompletedBadges;

